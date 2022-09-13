var myCustomCanvas = document.createElement('canvas');

myCustomCanvas.id = 'myCustomCanvas';
myCustomCanvas.style = 'border: 8px solid green';

document.body.appendChild(myCustomCanvas);

//  It's important to set the WebGL context values that Phaser needs:
var contextCreationConfig = {
    alpha: false,
    depth: false,
    antialias: true,
    premultipliedAlpha: true,
    stencil: true,
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: false,
    powerPreference: 'default'
};

var myCustomContext = myCustomCanvas.getContext('webgl', contextCreationConfig);

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    canvas: myCustomCanvas,
    context: myCustomContext,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/baal-loader.png');
}

function create ()
{
    this.add.image(400, 300, 'pic');
}
