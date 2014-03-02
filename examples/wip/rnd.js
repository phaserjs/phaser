
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {


}

var sprite;

function create() {

	for (var i = 0; i < 1000; i++)
	{
		var x = game.rnd.integerInRange(10, 20);

		if (x === 20)
		{
			console.log('>>>', x);
		}
		else if (x === 10)
		{
			console.log('---', x);
		}
		else
		{
			// console.log(x);
		}
	}

}

function update() {


}

function render() {

}
