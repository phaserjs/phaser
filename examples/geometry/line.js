
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

var handle1;
var handle2;

var line1;

function create() {

    game.stage.backgroundColor = '#124184';

    handle1 = game.add.sprite(100, 200, 'balls', 0);
    handle1.inputEnabled = true;
    handle1.input.enableDrag(true);

    handle2 = game.add.sprite(400, 300, 'balls', 0);
    handle2.inputEnabled = true;
    handle2.input.enableDrag(true);

    line1 = new Phaser.Line(handle1.x, handle1.y, handle2.x, handle2.y);

}

function update() {

    line1.fromSprite(handle1, handle2, true);
 
}

function render() {

    game.debug.line(line1);
    game.debug.lineInfo(line1, 32, 32);

    game.debug.text("Drag the handles", 32, 550);

}