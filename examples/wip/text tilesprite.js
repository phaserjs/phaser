
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('knightHawks', 'assets/fonts/KNIGHT3.png');
    game.load.script('filter', '../filters/Plasma.js');

}

var font;
var i;
var background;
var filter;

function create() {

    background = game.add.sprite(0, 0);
    background.width = 800;
    background.height = 600;

    filter = game.add.filter('Plasma', 800, 600);

    background.filters = [filter];

    font = game.add.bitmapFont('knightHawks', 31, 25, Phaser.BitmapFont.TEXT_SET6, 10, 1, 1);
    font.text = 'phaser was here';

    i = game.add.image(0, 0, font);

    // sprite = game.add.tileSprite(0, 0, 800, 600, font);

}

function update() {

    filter.update();

    //  Uncomment for coolness :)
    // filter.blueShift -= 0.001;


	// font.text = "phaser x: " + game.input.x + " y: " + game.input.y;

}
