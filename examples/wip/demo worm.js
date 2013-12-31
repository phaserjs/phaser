
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('ball', 'assets/sprites/shinyball.png');

}

var sprite;
var particles = [];
var bmd;

var u = 0;
var n = 0;
var oldn = 0;
var ad = 0;

function create() {

	bmd = game.add.bitmapData(640, 480);

	for (var i = 0; i < 30; i++)
	{
		particles.push(new Phaser.Point(0, 0));
	}

	sprite = game.add.sprite(0, 0, bmd);

}

function mycircle(context, x, y, R, color) {

	context.fillStyle = color;
	context.beginPath(); 
	context.arc(x, y, R, 0, Math.PI * 2, true);
	context.closePath();
	context.fill();

}

function update() {

	bmd.clear();

	oldn = n;

	for (var t = 0; t < particles.length; t++)
	{
		var p = particles[t];
		
		p.x = Math.sin(n) * 50 + Math.cos(n * 1.5) * 200;
		p.y = Math.sin(n / 2) * 20 + Math.sin(n * 2) * 150;

		var tx = p.x;
		var ty = p.y;

		bmd.context.globalCompositeOperation = 'xor';

		mycircle(bmd.context, p.x + 320, p.y + 240, Math.sin(t * 360 / particles.length / 2 * Math.PI / 180) * 60, 'rgba(255, 255, 255, 1)');

		n += 0.1;

		bmd.context.globalCompositeOperation = 'source-over';
	}

	n = oldn + 0.03;

}

function render() {

}
