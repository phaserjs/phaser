
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { create: create });

var text;
var grd;

function create() {

	game.stage.setBackgroundColor(0x2d2d2d);

    text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust");
    text.anchor.setTo(0.5);

    text.font = 'Arial Black';
    text.fontSize = 60;
    text.fontWeight = 'bold';

	grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
	grd.addColorStop(0, '#8ED6FF');   
	grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;

    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    text.inputEnabled = true;
    text.input.enableDrag();

    text.events.onInputOver.add(over, this);
    text.events.onInputOut.add(out, this);

}

function out() {

    text.fill = grd;

}

function over() {

    text.fill = '#ff00ff';

}
