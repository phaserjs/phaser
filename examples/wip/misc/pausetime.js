
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render });

function create() {

	console.log('game started at ' + this.time.now);

	game.onPause.add(onGamePause, this);
	game.onResume.add(onGameResume, this);

}

function onGamePause() {

	console.log('game paused at ' + this.time.now);

}

function onGameResume() {

	console.log('game un-paused at ' + this.time.now);
	console.log('was paused for ' + game.time.pauseDuration);

}

function render() {

	game.debug.text('now: ' + game.time.now, 32, 32);
	game.debug.text('paused: ' + game.paused, 32, 64);

}
