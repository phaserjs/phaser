var myCustomCanvas = document.createElement('canvas');

myCustomCanvas.id = 'myCustomCanvas';
myCustomCanvas.style = 'border: 8px solid red';

document.body.appendChild(myCustomCanvas);

// var myCustomContext = myCustomCanvas.getContext('2d');

var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    canvas: document.getElementById('myCustomCanvas'),
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
