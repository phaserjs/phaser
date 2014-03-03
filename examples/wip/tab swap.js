
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
    game.load.audio('boden', ['assets/audio/bodenstaendig_2000_in_rock_4bit.mp3', 'assets/audio/bodenstaendig_2000_in_rock_4bit.ogg']);

}

var mummy;
var anim;
var music;
var s = [];

function create() {

	game.stage.backgroundColor = 0x3d4d3d;

    music = game.add.audio('boden');
    music.play();

    mummy = game.add.sprite(500, 300, 'mummy', 5);
    mummy.scale.set(2);

    anim = mummy.animations.add('walk');

    anim.play(10, true);

    game.onPause.add(paused, this);
    game.onResume.add(resumed, this);

    var space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space.onDown.add(muteToggle, this);

    s.push('starting: ' + game.stage._hiddenVar);

}

function muteToggle() {

	if (game.sound.mute)
	{
		game.sound.mute = false;
	}
	else
	{
		game.sound.mute	= true;
	}

}

function pauseToggle() {

	if (game.paused)
	{
		game.paused = false;
	}
	else
	{
		game.paused = true;
	}

}

function paused() {

	s.push('paused now: ' + game.time.now);
	// console.log('paused now:', game.time.now);

}

function resumed() {

	s.push('resumed now: ' + game.time.now);
	s.push('pause duration: ' + game.time.pauseDuration);
	// console.log('resumed now:', game.time.now);
	// console.log('resumed duration:', game.time.pauseDuration);

}

function update() {

}

function render() {

	// game.debug.text(anim.frame + ' / 17', 32, 32);

	for (var i = 0; i < s.length; i++)
	{
		game.debug.text(s[i], 16, 160 + (16 * i));
	}

    game.debug.soundInfo(music, 20, 32);
	
}