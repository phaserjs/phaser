
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    this.load.image('logo', 'assets/sprites/phaser.png');

}

var image;

function create() {

    this.game.renderer.roundPixels = true;

    image = this.add.image(50, 50, 'logo');

    image.body = null;

    this.sys.physics.enable(image);

    this.sys.physics.gravity.y = 100;

    image.body.collideWorldBounds = true;

    image.body.velocity.x = 150;

    image.body.bounce.set(1);

}
