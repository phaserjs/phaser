
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);

}

var mummy;

function create() {

	game.stage.backgroundColor = 0x3d4d3d;

    mummy = game.add.sprite(300, 300, 'mummy', 5);

    var t = game.add.tween(mummy).to( { "x": 400, "y": 400 }, 5000, Phaser.Easing.Linear.None, true);

    // var t = game.add.tween(mummy).to( { "scale.x": 4, "scale.y": 4 }, 5000, Phaser.Easing.Linear.None, true);

    t.onComplete.add(tweenOver, this);

}

function tweenOver(a) {

	console.log('over');
	console.log(a);

}

function update() {

}

function render() {
	
}