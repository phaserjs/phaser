
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render });

var log = '';
var t;

function create() {

	log += 'game started at ' + this.time.now + '\n';
	// log += 'pagehide? ' + window['onpagehide'] + '\n';
	// log += 'blur? ' + window['blur'] + '\n';

	console.log('game started at ' + this.time.now);

	game.stage.backgroundColor = '#2d2d2d';

	game.onPause.add(onGamePause, this);
	game.onResume.add(onGameResume, this);

	t = game.add.text(32, 32, log, { font: '14px Arial', fill: '#ffffff' });

	// window.unload = function() { console.log('unload'); };

}

function onGamePause(event) {

	log += 'game paused at ' + this.time.now + '\n';
	log += 'event ' + event.type + '\n';

	console.log('game paused at ' + this.time.now);

}

function onGameResume(event) {

	log += 'game un-paused at ' + this.time.now + '\n';
	log += 'was paused for ' + game.time.pauseDuration + '\n';
	log += 'event ' + event.type + '\n';

	console.log('game un-paused at ' + this.time.now);
	console.log('was paused for ' + game.time.pauseDuration);

}

function render() {

	// console.log('tick');

	t.text = log;

	game.debug.text('now: ' + game.time.now, 500, 32);

	// game.debug.text(log, 32, 64);
	// game.debug.text('paused: ' + game.paused, 32, 64);

}
