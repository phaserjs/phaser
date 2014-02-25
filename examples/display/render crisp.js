
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('boss', 'assets/misc/boss1.png');
    game.load.image('melon', 'assets/sprites/melon.png');
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

}

var boss;
var melon;
var button;

function create() {
    
    boss = game.add.sprite(game.world.centerX, game.world.centerY, 'boss');
    boss.anchor.setTo(0.5, 0.5);

    melon = game.add.sprite(500, game.world.centerY, 'melon');
    melon.anchor.setTo(0.5, 0.5);

    //  For browsers that support it, this keeps our pixel art looking crisp (works across Canvas and WebGL)

    //  You can either set smoothing on a specific sprite, like this:
    // boss.smoothed = false;

    //  Or across the whole stage, like this:
    game.stage.smoothed = false;

    //  Zoom in each time we press the button
    button = game.add.button(32, 32, 'button', clickedIt, this, 2, 1, 0);
}

function clickedIt() {

    boss.scale.x += 0.5;
    boss.scale.y += 0.5;

    melon.scale.x += 0.5;
    melon.scale.y += 0.5;
    
}
