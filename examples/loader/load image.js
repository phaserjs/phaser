
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    //  Specify a unique key and a URL path
    //  The key must be unique between all images.
    game.load.image('imageKey', 'assets/sprites/phaser2.png');

}

function create() {

    game.add.sprite(0, 0, 'imageKey');

}
