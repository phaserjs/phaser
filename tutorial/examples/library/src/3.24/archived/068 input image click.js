
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    this.load.image('logo', 'assets/pics/coma-zero_gravity.png');
    this.load.image('green', 'assets/sprites/green_ball.png');
    this.load.image('red', 'assets/sprites/red_ball.png');

}

var red;
var green;
var image;

function create() {

    red = this.add.image(16, 16, 'red');
    green = this.add.image(16, 16, 'green');
    green.visible = false;

    image = this.add.image(400, 300, 'logo');
    image.anchor = 0.5;
    image.angle = 45;
    // image.scale = 0.5;

    image.input = new Phaser.InputHandler(image);

    image.input.start(0, true);

    image.input.onOver.add(over, this);
    image.input.onOut.add(out, this);
    image.input.onDown.add(clicked, this);

}

function over () {

    green.visible = true;
    red.visible = false;

}

function out () {

    green.visible = false;
    red.visible = true;

}

function clicked () {

    var tl = Phaser.Math.between(8388607, 16777215);
    var tr = Phaser.Math.between(8388607, 16777215);
    var bl = Phaser.Math.between(8388607, 16777215);
    var br = Phaser.Math.between(8388607, 16777215);

    image.color.setTint(tl, tr, bl, br);

}