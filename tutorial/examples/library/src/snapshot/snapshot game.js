var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var div = document.createElement('div');
div.innerHTML = 'PRESS SPACE TO TAKE SNAPSHOT<br>';
document.body.appendChild(div);
var time = 0;
var snapHistory = [];
var graphics;
var graphicsPath = [];
var isMouseDown = false;
var isKeyDown = false;
var game = new Phaser.Game(config);

function preload () {
    this.load.image('myImage', 'assets/sprites/phaser1.png');
    this.load.glsl('shader0', 'assets/shaders/shader0.frag');
}

function create ()
{

    for (var i = 0; i < 5; ++i)
    {
        var image = this.add.image(Math.random() * 800, Math.random() * 600, 'myImage');
    }
    
    graphics = this.add.graphics({x: 0, y: 0});

    game.canvas.onmousedown = function (e) {
        isMouseDown = true;
        graphics.clear();
        graphicsPath.length = 0;
    };
    game.canvas.onmouseup = function (e) {
        isMouseDown = false;
    };
    game.canvas.onmousemove = function (e) {
        var mouseX = e.clientX - game.canvas.offsetLeft;
        var mouseY = e.clientY - game.canvas.offsetTop;
        if (isMouseDown)
            graphicsPath.push({x: mouseX, y: mouseY});
    };
    window.onkeydown = function (e)
    {
        if (e.keyCode === 32 && !isKeyDown)
        {
            game.renderer.snapshot(function (image) {
                image.style.width = '160px';
                image.style.height = '120px';
                image.style.paddingLeft = '2px';
                snapHistory.push(image);
                console.log('snap!');
                document.body.appendChild(image);
            });
            isKeyDown = true;
        }
    };
    window.onkeyup = function (e)
    {
        if (e.keyCode === 32)
        {
            isKeyDown = false;
        }
    };
}

function update ()
{
    var length = graphicsPath.length;

    graphics.clear();
    graphics.lineStyle(10.0, 0xFFFF00, 1.0);
    graphics.beginPath();
    for (var i = 0; i < length; ++i)
    {
        var node = graphicsPath[i];

        if (i !== 0)
        {
            graphics.lineTo(node.x, node.y);
        }
        else
        {
            graphics.moveTo(node.x, node.y);
        }
    }
    graphics.strokePath();
    graphics.closePath();

    time += 0.01;
}