
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
    game.load.image('background','assets/misc/starfield.jpg');

}

var button;
var background;

function create() {

    game.stage.backgroundColor = '#182d3b';

    background = game.add.tileSprite(0, 0, 800, 600, 'background');

    button = game.add.button(game.world.centerX - 95, 200, 'button', actionOnClick, this, 2, 1, 0);
    button.anchor.setTo(0.5, 0.5);

    button.scale.setTo(2, 2);
    // button.width = 100;
    // button.height = 300;
    button.angle = 10;

}

function actionOnClick () {

    background.visible =! background.visible;

}

function render () {

    game.debug.spriteCorners(button);

    game.debug.point(button.input._tempPoint);

}
