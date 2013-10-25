
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('boss', 'assets/misc/boss1.png');
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

}

var boss;
var button;

function create() {
    
    //  For browsers that support it, this keeps our pixel art looking crisp
    // This only works when you use Phaser.CANVAS as the renderer
    Phaser.Canvas.setSmoothingEnabled(game.context, false);

    boss = game.add.sprite(game.world.centerX, game.world.centerY, 'boss');
    boss.anchor.setTo(0.5, 0.5);

    //  Zoom in each time we press the button
    button = game.add.button(32, 32, 'button', clickedIt, this, 2, 1, 0);
}

function clickedIt() {

    boss.scale.x += 0.5;
    boss.scale.y += 0.5;
    
}
