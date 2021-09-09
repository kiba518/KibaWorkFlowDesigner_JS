/* global $, visoConfig, Mustache, uuid, jsPlumb, graphlib */

(function () {
    var root = {}

    window.FlowDeginer = root

    root.emit = function (event) {
        console.log(event)
    }
    root.exportToJson =function () {
        DataProcess.setNodesPosition(data.nodeList)
        var json = JSON.stringify(data.nodeList)
        return json;
    }
    var area = 'drop-bg'
    var areaId = '#' + area
   
    //main入口
    jsPlumb.ready( 
        function () {
            console.log("main-start")
            jsPlumb.setContainer('diagramContainer')
           
            $('.btn-controler').draggable({
                helper: 'clone',
                scope: 'ss'
            })

            $(areaId).droppable({
                scope: 'ss',
                drop: function (event, ui) {
                    dropNode(ui.draggable[0].dataset.template, ui.position)
                }
            })

            $('#app').on('click', function (event) { 
                
                event.stopPropagation()
                event.preventDefault() 
                var item = event.target.dataset
                
                if (item.type === 'deleteNode') {
                    var index = -1;
                    data.nodeList.forEach(function (node, i) {
                        if (node.id == item.id) {
                            index = i;
                        }
                    })
                    data.nodeList.splice(index, 1);
                    console.log(data.nodeList)
                    jsPlumb.remove(item.id)
                }
              
            })
            //jsPlumb.on(areaId, "click", ".add-node", function () {
            //    console.log(this)
            //    jsPlumb.addToDragSelection(this.parentNode);
            //});
            // 单点击了连接线上的X号
            jsPlumb.bind('dblclick', function (conn, originalEvent) {
                DataDraw.deleteLine(conn)
            }) 
          
            // 当链接建立
            jsPlumb.bind('beforeDrop', function (info) {
                console.log("beforeDrop")  
                console.log(info)
                var isSame = false;
                data.nodeList.forEach(function (node) {
                    if (info.sourceId == node.id) {
                        if (!node.data) {
                            node.data = []
                            var nextNode = {
                                "nextNode": info.targetId
                            }
                            node.data.push(nextNode)
                        }
                        else {
                             
                            node.data.forEach(function (dItem){
                                if (dItem.nextNode == info.targetId) {
                                    isSame = true;
                                    return;
                                } 
                            })
                            if (!isSame) {
                                var nextNode = {
                                    "nextNode": info.targetId
                                }
                                node.data.push(nextNode)
                            }
                         
                        }
                       
                    }

                }) 
                if (!isSame) {
                    console.log(data.nodeList)
                    return connectionBeforeDropCheck(info)
                }
                else {
                    console.log("节点相同")
                    return
                }
            }) 
            console.log("main-DataDraw.draw")
            DataDraw.draw(data.nodeList)
            console.log("初始化节点文本事件")
            initNodeTextEvent();
  
        })
    jsPlumb.importDefaults({
        ConnectionsDetachable: true
    })
  
    function initNodeTextEvent() {
        $(".nodeText").bind('input propertychange', function (e) {
           
            var id = $(e.target).attr('tag')
            var v = $(this).val().toString()
            data.nodeList.forEach(function (node) {
                if (id == node.id) {
                    node.comment = v 
                }
            })
        });
    }
    // 放入拖动节点
    function dropNode(template, position) {
        
        position.left -= $('#side-buttons').outerWidth()
        position.id = uuid.v1()
        position.generateId = uuid.v1
        var html = renderHtml(template, position)

        $(areaId).append(html)

        initSetNode(template, position.id)

        var node = {
            id: position.id,
            comment: "",
            top: position.top,
            left: position.left,
            type: template.replace("tpl-", "")
        }
        data.nodeList.push(node)
   
        initNodeTextEvent();
    }

    // 初始化节点设置
    function initSetNode(template, id) {
        addDraggable(id)
        var config1 = getBaseNodeConfig()
        config1.isSource = false;
        // 设置入口点
        jsPlumb.addEndpoint(id, {
            anchors: 'Top',
            uuid: id + '-in'
        }, config1)
        // 设置出口点
        var config2 = getBaseNodeConfig()
        config2.isTarget = false;
        jsPlumb.addEndpoint(id, {
            anchors: 'Bottom',
            uuid: id + '-out'
        }, config2)
    }
     
    // 让元素可拖动
    function addDraggable(id) {
        jsPlumb.draggable(id, {
            containment: 'parent'
        }) 
    }

    // 渲染html
    function renderHtml(type, position) {
        return Mustache.render($('#' + type).html(), position)
    }

     

   

    // 链接建立后的检查
    // 当出现自连接的情况后，要将链接断开
    function connectionBeforeDropCheck(info) {
        if (!info.connection.source.dataset.pid) {
            return true
        }
        return info.connection.source.dataset.pid !== info.connection.target.dataset.id
    }

    // 获取基本配置
    function getBaseNodeConfig() {
        return Object.assign({}, visoConfig.baseStyle)
    }
     
    var DataProcess = {
        inputData: function (nodes) {
            var ids = this.getNodeIds(nodes)
            var g = new graphlib.Graph()

            ids.forEach(function (id) {
                g.setNode(id)
            })

            var me = this
          
            nodes.forEach(function (item) { 
                if (me['dealNode' + item.type]) {  
                    me['dealNode' + item.type](g, item)
                } else {
                    console.error('have no deal node of ' + item.type)
                }
            })
           
            console.log("dijkstra")
            var distance = graphlib.alg.dijkstra(g, 'Start')

            return this.generateDepth(distance)
        },
        setNodesPosition: function (nodes) {
            var me = this
            nodes.forEach(function (item) {
                me.getNodePosition(item)
            })
        },
        getNodePosition: function (node) {
            var $node = document.getElementById(node.id)
            node.top = parseInt($node.style.top)
            node.left = parseInt($node.style.left)
        },
        generateDepth: function (deep) {
            console.log("generateDepth")
            var depth = []

            Object.keys(deep).forEach(function (key) {
                var distance = deep[key].distance

                if (!depth[distance]) {
                    depth[distance] = []
                }

                depth[distance].push(key)
            })

            return depth
        },
        getNodeIds: function (nodes) {
            return nodes.map(function (item) {
                return item.id
            })
        },
        dealNodeRoot: function (g, node) {
            if (!node.data) {
                return;
            }
            this.setEdge(g, node.id, node.id)
        },
        dealNodeNormal: function (g, node) {
            console.log(node.data)
            this.setEdge(g, node.id, node.id)
        },
        dealNodeExit: function (g, node) {

        },
        setEdge: function name(g, from, to) { 
            console.log("from:"+from + ' ---> to:' + to)
            g.setEdge(from, to)
        }
    }

    var DataDraw = {
        deleteLine: function (conn) {
            
            if (confirm('确定删除所点击的链接吗？')) { 
                jsPlumb.detach(conn)
                console.log(conn.sourceId + " " + conn.targetId)
                data.nodeList.forEach(function (node) {
                    if (node.id == conn.sourceId) {
                        var index = -1;
                        node.data.forEach(function (item, i) {
                            if (item.nextNode == conn.targetId) {
                                index = i;
                            }
                        })
                        node.data.splice(index, 1);
                    }

                })
            }
        },
        draw: function (nodes) {
            // 将Exit节点排到最后
            nodes.sort(function (a, b) {
                if (a.type === 'Exit') return 1
                if (b.type === 'Exit') return -1
                return 0
            })

            this.computeXY(nodes)

            // var template = $('#tpl-demo').html()
            var $container = $(areaId)
            var me = this

            nodes.forEach(function (item, key) {
                var template = me.getTemplate(item)//根据data-template属性获取模板 
                $container.append(Mustache.render(template, item))
                if (me['addEndpointOf' + item.type]) {
                    me['addEndpointOf' + item.type](item)
                }
            })
            this.mainConnect(nodes)
        },

        connectEndpoint: function (from, to) {
            
            jsPlumb.connect({ uuids: [from, to] })
        },
        mainConnect: function (nodes) {
            var me = this
            nodes.forEach(function (item) {
                if (me['connectEndpointOf' + item.type]) { 
                    me['connectEndpointOf' + item.type](item)
                }
            })
        },
        getTemplate: function (node) {
            return $('#tpl-' + node.type).html() || $('#tpl-demo').html()
        },
        computeXY: function (nodes) {
            var matrix = DataProcess.inputData(nodes)

            var base = {
                topBase: 50,
                topStep: 150,
                leftBase: 150,
                leftStep: 200
            }


            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    var key = matrix[i][j]

                    var dest = nodes.find(function (item) {
                        return item.id === key
                    })

                    dest.top = dest.top || base.topBase + i * base.topStep
                    dest.left = dest.left || base.leftBase + j * base.leftStep
                }
            }

        },
        addEndpointOfRoot: function (node) {
            addDraggable(node.id)
            //initBeginNode(node.id)
            var id = node.id
            var config = getBaseNodeConfig()
            config.isTarget = false;
            jsPlumb.addEndpoint(id, {
                anchors: 'Bottom',
                uuid: id + '-out'
            }, config)
        },
        addEndpointOfExit: function (node) {
            addDraggable(node.id)
            //initEndNode(node.id)
            var id = node.id
            var config = getBaseNodeConfig() 
            config.isSource = false 
            jsPlumb.addEndpoint(id, {
                anchors: 'Top',
                uuid: id + '-in'
            }, config)
        },
        addEndpointOfNormal: function (node) {
            var id = node.id
            addDraggable(id)
            var config1 = getBaseNodeConfig()
            config1.isSource = false;
            config1.isTarget = true;
            // 设置入口点
            jsPlumb.addEndpoint(id, {
                anchors: 'Top',
                uuid: id + '-in'
            }, config1)
            // 设置出口点
            var config2 = getBaseNodeConfig()
            config2.isSource = true;
            config1.isTarget = false;
            jsPlumb.addEndpoint(id, {
                anchors: 'Bottom',
                uuid: id + '-out'
            }, config2)
             
           
        },

        connectEndpointOfRoot: function (node) { 
            console.log("开始节点划线")
            if (!!node.data) {
                node.data.forEach(function (item) {
                    
                    DataDraw.connectEndpoint(node.id + '-out', item.nextNode + '-in')
                })
            } 
            console.log("开始节点划线-结束")
        },
        connectEndpointOfNormal: function (node) {
            console.log("普通节点划线")
            if (!!node.data) {
                node.data.forEach(function (item) { 
                    DataDraw.connectEndpoint(node.id + '-out', item.nextNode + '-in')
                })
            }
            console.log("普通节点划线-结束")
        }


    }

    root.DataProcess = DataProcess
    root.DataDraw = DataDraw
})()
