
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var handle1;
var handle2;
var handle3;
var handle4;

var line1;
var line2;

function create() {

    game.stage.backgroundColor = '#124184';

    handle1 = game.add.sprite(100, 200, 'balls', 0);
    handle1.inputEnabled = true;
    handle1.input.enableDrag(true);

    handle2 = game.add.sprite(400, 300, 'balls', 0);
    handle2.inputEnabled = true;
    handle2.input.enableDrag(true);

    handle3 = game.add.sprite(200, 400, 'balls', 1);
    handle3.inputEnabled = true;
    handle3.input.enableDrag(true);

    handle4 = game.add.sprite(500, 500, 'balls', 1);
    handle4.inputEnabled = true;
    handle4.input.enableDrag(true);

    line1 = new Phaser.Line(handle1.x, handle1.y, handle2.x, handle2.y);
    line2 = new Phaser.Line(handle3.x, handle3.y, handle4.x, handle4.y);

}

var c = 'rgb(255,255,255)';
var p = new Phaser.Point();

function update() {

    line1.fromSprite(handle1, handle2, true);
    line2.fromSprite(handle3, handle4, true);

    p = line1.intersects(line2, true);

    if (p)
    {
        c = 'rgb(0,255,0)';
    }
    else
    {
        c = 'rgb(255,255,255)';
    }
 
}

function render() {

    game.debug.line(line1, c);
    game.debug.line(line2, c);

    game.debug.lineInfo(line1, 32, 32);
    game.debug.lineInfo(line2, 32, 100);

    if (p)
    {
        game.context.fillStyle = 'rgb(255,0,255)';
        game.context.fillRect(p.x - 2, p.y - 2, 5, 5);
    }

    game.debug.text("Drag the handles", 32, 550);

}