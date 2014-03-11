
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update });

var text;

function create() {

	game.stage.setBackgroundColor(0x2d2d2d);

    text = game.add.text(game.world.centerX, game.world.centerY, '- phaser text stroke -');

    //	Center align
    text.anchor.set(0.5);
    text.align = 'center';

    //	Font style
    text.font = 'Arial Black';
    text.fontSize = 50;
    text.fontWeight = 'bold';

    //	Stroke color and thickness
    text.stroke = '#000000';
    text.strokeThickness = 6;
    text.fill = '#43d637';

}

function update() {

    // text.angle += 1;

}
