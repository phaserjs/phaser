
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

var p;
var tween;
var button;
var flag = true;

function preload() {

    game.load.image('diamond', 'assets/sprites/diamond.png');
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

}

function create() {

    game.stage.backgroundColor = 0x2d2d2d;

    p = game.add.sprite(100, 100, 'diamond');

    tween = game.add.tween(p).to({ x: 600 }, 4000, Phaser.Easing.Linear.None, true, 0, 1000, true)

    button = game.add.button(game.world.centerX, 400, 'button', actionOnClick, this, 2, 1, 0);

}

function actionOnClick() {

    if (flag)
    {
        tween.pause();
    }
    else
    {
        tween.resume();
    }

    flag = !flag;

}
