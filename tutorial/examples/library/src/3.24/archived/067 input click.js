
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    this.load.image('logo', 'assets/sprites/phaser.png');

}

var image;

function create() {

    this.input.onDown.add(clicked, this);

    // image.input = new Phaser.InputHandler(image);

    // image.input.start(0, true);

}

function clicked (pointer) {

    var image = this.add.image(pointer.x, pointer.y, 'logo');
    image.anchor = 0.5;
    image.angle = Phaser.Math.between(-45, 45);

}