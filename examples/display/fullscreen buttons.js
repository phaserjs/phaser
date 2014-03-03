
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('dragon', 'assets/pics/cougar_dragonsun.png');
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

}

var button;
var sprite;

function create() {

    sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'dragon');
    sprite.anchor.set(0.5);

    game.stage.backgroundColor = '#000';

    // Stretch to fill
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Keep original size
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    // Maintain aspect ratio
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    button = game.add.button(game.world.centerX - 95, 500, 'button', actionOnClick, this, 2, 1, 0);
    button.visible = false;

    game.scale.enterFullScreen.add(onEnterFullScreen, this);
    game.scale.leaveFullScreen.add(onLeaveFullScreen, this);

    game.input.onDown.add(gofull, this);

}

function onEnterFullScreen() {

    button.visible = true;

}

function onLeaveFullScreen() {

    button.visible = false;
    
}

function gofull() {

    game.scale.startFullScreen();

}

function actionOnClick () {

    sprite.tint = Math.random() * 0xFFFFFF;

}

function update() {

}

function render () {

    if (game.scale.isFullScreen)
    {
        game.debug.text('ESC to leave fullscreen', 270, 16);
    }
    else
    {
        game.debug.text('Click / Tap to go fullscreen', 270, 16);
    }

}
