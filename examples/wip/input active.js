
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var dropper;

function create() {

	dropper = game.add.sprite(200, 400, 'mushroom');
    dropper.inputEnabled = true;
    dropper.input.enableDrag();
    dropper.events.onDragStart.add(prepareToKill, this);

}

function prepareToKill() {

	console.log('3 sec warning');

	var t = { time: 0 };

	var tween = game.add.tween(t).to({time: 1}, 3000, Phaser.Easing.Linear.None, true);
	tween.onComplete.add(nukeIt, this);

}

function nukeIt() {

	console.log('nuked');
	dropper.destroy();

}
