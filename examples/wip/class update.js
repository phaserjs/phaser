
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

ClassA = function(game, x, y, texture) {
	Phaser.Sprite.call(this, game, x, y, texture);
}

ClassA.prototype = Object.create(Phaser.Sprite.prototype);
ClassA.prototype.constructor = ClassA;

ClassA.prototype.update = function() {
   console.log("here");
}

function preload() {

	game.load.image('pic', 'assets/pics/questar.png');

}

var sprite;

function create() {

	sprite = new ClassA(game, 100, 100, 'pic');

	game.add.existing(sprite);

}

function update() {


}

function render() {

}
