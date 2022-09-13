var stepCount = 0;
var rafCount = 0;

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('chunk', 'assets/sprites/chunk.png');
}

function create ()
{
    this.input.on('pointerdown', function ()
    {
        this.sys.game.loop.raf.stop();
    }, this);
}

function update ()
{
    this.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 600), 'chunk');
}


/*
var c = document.createElement('canvas');
c.width = 320;
c.height = 320;
document.getElementById('phaser-example').appendChild(c);
var ctx = c.getContext('2d');
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, 320, 320);
ctx.fillStyle = '#fff';

var stepCount = 0;
var doCount = 0;

function doStuff (timestamp)
{
    doCount++;
    ctx.fillRect(Math.random() * 320, Math.random() * 320, 1, 1);
}

var step = function step (timestamp)
{
    stepCount++;

    doStuff(timestamp);

    window.requestAnimationFrame(step);
};

window.requestAnimationFrame(step);

document.body.addEventListener('mousedown', function ()
{
    debugger;
});

*/
