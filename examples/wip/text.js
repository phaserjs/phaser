
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false);
// var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false);

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var text;

function create() {

	game.stage.backgroundColor = '#c48844';

    text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust");

    text.anchor.setTo(0.5);

    text.font = 'Art of Fighting 2';
    // text.font = 'Arial';
    text.fontSize = 40;
    // text.fontWeight = 'bold italic';

    //	x0, y0 - x1, y1
	var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);

	grd.addColorStop(0, '#8ED6FF');   
	grd.addColorStop(1, '#004CB3');

    // text.fill = '#ff0044';
    // text.lineSpacing = 16;
    text.fill = grd;
    text.align = 'center';
    text.stroke = '#ff00ff';
    text.strokeThickness = 2;

    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    game.input.onDown.add(change, this);

}

function change() {

	text.tint = Math.random() * 0xFFFFFF;

}

function update() {


}

function render() {

	// game.debug.renderText(sprite.position.y, 32, 32);

}
