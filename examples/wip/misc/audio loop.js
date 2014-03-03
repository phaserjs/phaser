
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.audio('music', 'assets/audio/CatAstroPhi_shmup_normal.wav');

}

var music;

function create() {

	music = game.add.audio('music');

	//	play: function (marker, position, volume, loop, forceRestart) {

	music.play('', 0, 1, true);

	game.input.onDown.add(toggleAudio, this);

}

function toggleAudio() {

	if (music.isPlaying)
	{
		music.pause();
	}
	else
	{
		music.resume();
	}

}

function update() {


}

function render() {

	game.debug.soundInfo(music, 32, 32);

}
