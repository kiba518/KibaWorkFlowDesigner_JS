var visoConfig = {
  visoTemplate: {}
}

  
// 基本连接线样式
visoConfig.connectorPaintStyle = {
  lineWidth: 2,
  strokeStyle: '#61B7CF',
  joinstyle: 'round',
  fill: 'pink',
  outlineColor: '',
  outlineWidth: ''
}

// 鼠标悬浮在连接线上的样式
visoConfig.connectorHoverStyle = {
  lineWidth: 2,
  strokeStyle: 'red',
  outlineWidth: 10,
  outlineColor: ''
}

visoConfig.baseStyle = {
  endpoint: ['Dot', {
    radius: 8,
    fill: 'pink'
  }], // 端点的形状
  connectorStyle: visoConfig.connectorPaintStyle, // 连接线的颜色，大小样式
  connectorHoverStyle: visoConfig.connectorHoverStyle,
  paintStyle: {
    strokeStyle: '#1e8151',
    stroke: '#7AB02C',
    fill: 'pink',
    fillStyle: '#1e8151',
    radius: 6,
    lineWidth: 2
  }, // 端点的颜色样式
  // hoverPaintStyle: {
  //   outlineStroke: 'pink'
  // },
  hoverPaintStyle: { stroke: 'blue' },
  isSource: true, // 是否可以拖动（作为连线起点）
  connector: ['Flowchart', { gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],  // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
  isTarget: true, // 是否可以放置（连线终点）
  maxConnections: -1, // 设置连接点最多可以连接几条线
  connectorOverlays: [
    ['Arrow', {
      width: 10,
      length: 10,
      location: 1
    }],
    ['Arrow', {
      width: 10,
      length: 10,
      location: 0.2
    }],
    ['Arrow', {
      width: 10,
      length: 10,
      location: 0.7
    }],
    ['Label', {
      label: '',
      cssClass: '',
      labelStyle: {
        color: 'red'
      },
      events: {
        click: function (labelOverlay, originalEvent) {
          console.log('click on label overlay for :' + labelOverlay.component)
          console.log(labelOverlay)
          console.log(originalEvent)
        }
      }
    }]
  ]
}

visoConfig.baseArchors = ['RightMiddle', 'LeftMiddle']
////////////////////////////////
var config2 = {}
config2.connectorPaintStyle = {
    lineWidth: 1,
    strokeStyle: '#4caf50',
    joinstyle: 'round',
    fill: 'pink',
    outlineColor: '',
    outlineWidth: ''
}

// 鼠标悬浮在连接线上的样式
config2.connectorHoverStyle = {
    lineWidth: 2,
    strokeStyle: 'red',
    outlineWidth: 10,
    outlineColor: ''
}

var baseStyle = {
    endpoint: ['Dot', {
        radius: 8,
        fill: '#ff5722'
    }], // 端点的形状
    connectorStyle: config2.connectorPaintStyle, // 连接线的颜色，大小样式
    connectorHoverStyle: config2.connectorHoverStyle,
    paintStyle: {
        fillStyle: '#4caf50',
        radius: 6
        // lineWidth: 0
    }, // 端点的颜色样式
    hoverPaintStyle: {
        fillStyle: 'red',
        strokeStyle: 'red'
    },
    isSource: true, // 是否可以拖动（作为连线起点）
    connector: ['Straight', {
        gap: 0,
        cornerRadius: 5,
        alwaysRespectStubs: true
    }], // 连接线的样式种类有[Bezier],[Flowchart],[StateMachine ],[Straight ]
    isTarget: true, // 是否可以放置（连线终点）
    maxConnections: -1, // 设置连接点最多可以连接几条线
    connectorOverlays: [
        ['Arrow', {
            width: 10,
            length: 10,
            location: 1
        }],
        ['Label', {
            label: '',
            cssClass: '',
            labelStyle: {
                color: 'red'
            },
            events: {
                click: function (labelOverlay, originalEvent) {
                    console.log('click on label overlay for :' + labelOverlay.component)
                    console.log(labelOverlay)
                    console.log(originalEvent)
                }
            }
        }]
    ]
}