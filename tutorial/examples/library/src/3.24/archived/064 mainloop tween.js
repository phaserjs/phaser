
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, fps: 10 });

function preload() {

    this.load.image('logo', 'assets/sprites/phaser2.png');

}

var logo;

function create() {

    logo = this.add.image(400, 300, 'logo');
    logo.anchor = 0.5;
    logo.scale = 0.2;
    logo.angle = 180;

    logo.transform.enableInterpolation();

    this.add.tween(logo).to( { scale: 1, angle: 0 }, 3000, "Sine.easeInOut", true, 2000, -1, true);

}
