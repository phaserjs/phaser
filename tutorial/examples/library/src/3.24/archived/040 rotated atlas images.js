
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.atlas('atlas', 'assets/sprites/atlas-mixed-rotated.png', 'assets/sprites/atlas-mixed-rotated.json');

}

var img0;
var img1;
var img2;
var img3;

function create() {

    //  This one isn't rotated in the atlas
    img0 = game.add.image(0, 0, 'atlas', 'spyro', game.stage);

    //  But all of these are
    img1 = game.add.image(200, 0, 'atlas', 'sonic_havok_sanity', game.stage);
    img2 = game.add.image(320, 200, 'atlas', 'nanoha_taiken_blue', game.stage);
    img3 = game.add.image(100, 500, 'atlas', 'pacman_by_oz_28x28', game.stage);

}
