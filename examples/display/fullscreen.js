
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');

}

function create() {

    var sprite = game.add.sprite(0, 0, 'atari1');

    game.stage.backgroundColor = '#e3ed49';

    // Stretch to fill
//    game.stage.fullScreenScaleMode = Phaser.StageScaleMode.EXACT_FIT;
    // Keep original size
//    game.stage.fullScreenScaleMode = Phaser.StageScaleMode.NO_SCALE;
    // Maintain aspect ratio
    game.stage.fullScreenScaleMode = Phaser.StageScaleMode.SHOW_ALL;

    game.input.onDown.add(gofull, this);

}

function gofull() {

    game.scale.startFullScreen();

}

function update() {

    if (document.getElementsByTagName('body')[0].scrollTop > 1000)
    {
        game.stage.backgroundColor = '#87ff55';
        window.scrollTo(0, 0);
    }

}

function render () {

    game.debug.renderText('Tap to go fullscreen', 32, 150);

}
