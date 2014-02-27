
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

	game.load.image('pic', 'assets/pics/backscroll.png');

}

var text;
var b;
var grd;

function create() {

	game.stage.setBackgroundColor(0x2d2d2d);

    text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust");
    text.anchor.set(0.5);

    text.font = 'Art of Fighting 2';
    // text.font = 'Arial Black';
    text.fontSize = 20;
    text.fontWeight = 'bold';

    //	x0, y0 - x1, y1
	grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
	grd.addColorStop(0, '#8ED6FF');   
	grd.addColorStop(1, '#004CB3');
    text.fill = grd;

    // text.fill = '#ff0044';
    // text.lineSpacing = 16;
    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;

    // text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    // text.scale.set(4);

    // game.add.tween(text).to({fontSize: 60}, 1000, Phaser.Easing.Linear.None,true);
    game.add.tween(text.scale).to({x: 6, y: 6}, 2000, Phaser.Easing.Linear.None,true);

}

