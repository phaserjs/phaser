
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });
// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('knightHawks', 'assets/fonts/KNIGHT3.png');
    game.load.script('filter', '../filters/Plasma.js');

}

var font;
var i;
var background;
var filter;
var count = 0;

function create() {

    game.world.setBounds(0, 0, 2000, 600);

    background = game.add.sprite(0, 0);
    background.width = 800;
    background.height = 600;

    filter = game.add.filter('Plasma', 800, 600);

    background.filters = [filter];

    font = game.add.bitmapFont('knightHawks', 31, 25, Phaser.BitmapFont.TEXT_SET6, 10, 1, 1);
    font.text = 'phaser ';

    // i = game.add.image(0, 0, font);

    sprite = game.add.tileSprite(0, 0, 800, 600, font);

}

function update() {

    count += 0.005

    sprite.tileScale.x = 2 + Math.sin(count);
    sprite.tileScale.y = 2 + Math.cos(count);
    
    sprite.tilePosition.x += 1;
    sprite.tilePosition.y += 1;


    // game.camera.view.x++;

    filter.update();

    //  Uncomment for coolness :)
    // filter.blueShift -= 0.001;

	font.text = "  phaser x: " + game.input.x + " y: " + game.input.y;
    sprite.refreshTexture = true;

}
