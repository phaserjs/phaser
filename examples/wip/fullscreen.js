
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('dragon', 'assets/pics/cougar_dragonsun.png');

}

function create() {

    var sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'dragon');
    sprite.anchor.set(0.5);

    game.stage.backgroundColor = '#000';

    // Stretch to fill
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Keep original size
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;

    // Maintain aspect ratio
    // game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.input.onDown.add(gofull, this);

}

function gofull() {

    game.scale.startFullScreen();

}

function update() {

}

function render () {

    game.debug.renderText('Click / Tap to go fullscreen', 270, 16);

}
