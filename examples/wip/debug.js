
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var tilesprite;
var cursors;
var count = 0;

function preload() {

    game.load.image('starfield', 'assets/misc/starfield.jpg');
    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');

}

var sprite;

function create() {

    var tile = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    tile.autoScroll(0, 200);

    sprite = game.add.image(200, 200, 'mummy');

}

function update() {

}

function render() {

    game.debug.spriteInfo(sprite, 32, 32);

}
