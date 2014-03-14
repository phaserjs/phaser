
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create });


function create() {

	var line = new Phaser.Line(100, 50, 10, 300);

	var coords = line.coordinatesOnLine(8);

	var bmd = game.add.bitmapData(800, 600);
	bmd.context.fillStyle = '#ffffff';
	var bg = game.add.sprite(0, 0, bmd);

	for (var i = 0; i < coords.length; i++)
	{
		bmd.context.fillRect(coords[i][0], coords[i][1], 1, 1);
	}

}
