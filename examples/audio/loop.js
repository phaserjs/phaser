
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create});

function preload() {

    game.load.image('spyro', 'assets/pics/spyro.png');

    //  Firefox doesn't support mp3 files, so use ogg
    game.load.audio('squit', ['assets/audio/SoundEffects/squit.mp3', 'assets/audio/SoundEffects/squit.ogg']);

}

var s;
var music;

function create() {

    game.stage.backgroundColor = '#255d3b';


    music = game.add.audio('squit',1,true);

    music.play('',0,1,true);

    s = game.add.sprite(game.world.centerX, game.world.centerY, 'spyro');
    s.anchor.setTo(0.5, 0.5);

}
