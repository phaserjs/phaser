
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false);
// var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update, render: render }, false);

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var text;
var b;

function create() {

	game.stage.backgroundColor = '#2d2d2d';

    // text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust");
    text = game.add.text(game.world.centerX, game.world.centerY, "- phaser - with a sprinkle of pixi dust");

    text.anchor.setTo(0.5);

    text.font = 'Art of Fighting 2';
    // text.font = 'Arial';
    text.fontSize = 30;
    // text.fontWeight = 'bold italic';

    //	x0, y0 - x1, y1
	// var grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
	// grd.addColorStop(0, '#8ED6FF');   
	// grd.addColorStop(1, '#004CB3');
    // text.fill = grd;

    text.fill = '#ff0044';
    // text.lineSpacing = 16;
    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;

    // text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    text.wordWrap = true;
    text.wordWrapWidth = 50;

    // game.input.onDown.add(change, this);

    text.inputEnabled = true;
    text.input.enableDrag();

    text.events.onInputOver.add(over, this);
    text.events.onInputOut.add(out, this);

}

function out() {

    text.fill = '#ff0044';

}

function over() {

    text.fill = '#ff00ff';

}

function change() {

	text.tint = Math.random() * 0xFFFFFF;

}

function update() {
    b = text.getBounds();


}

function render() {

    game.debug.renderRectangle(b);
	// game.debug.renderText(sprite.position.y, 32, 32);

}
