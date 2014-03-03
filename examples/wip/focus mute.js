
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('disk', 'assets/sprites/ra_dont_crack_under_pressure.png');

    //  Firefox doesn't support mp3 files, so use ogg
    game.load.audio('boden', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);

}

var s;
var music;

function create() {

    game.stage.backgroundColor = '#182d3b';
    game.input.touch.preventDefault = false;

    music = game.add.audio('boden');
    music.play();

    s = game.add.sprite(game.world.centerX, game.world.centerY, 'disk');
    s.anchor.setTo(0.5, 0.5);

    game.input.onDown.add(changeVolume, this);

}

function changeVolume(pointer) {

    if (pointer.y < 300)
    {
        game.sound.volume += 0.1;
        // music.volume += 0.1;
    }
    else
    {
        game.sound.volume -= 0.1;
        // music.volume -= 0.1;
    }

}

function update() {
    s.rotation += 0.01;
}

function render() {
    game.debug.soundInfo(music, 20, 32);
}

