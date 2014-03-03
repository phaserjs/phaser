
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('ball', 'assets/sprites/wizball.png');
    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');

}

var image;
var image2;
var jellyfish;

var down;
var p;
var c;

function create() {

    image = game.add.image(200, 200, 'mushroom');
    image2 = game.add.image(400, 200, 'ball');

    // image.rotation = 0.8;

    image.inputEnabled = true;

    image.events.onInputDown.add(clicked, this);
    image.events.onInputOver.add(over, this);
    image.events.onInputOut.add(out, this);



    image2.hitArea = new Phaser.Circle(image2.width / 2, image2.height / 2, 90);
    image2.inputEnabled = true;

    image2.events.onInputDown.add(clicked, this);
    image2.events.onInputOver.add(over, this);
    image2.events.onInputOut.add(out, this);



    jellyfish = game.add.sprite(500, 450, 'seacreatures', 'octopus0000');
    jellyfish.inputEnabled = true;
    jellyfish.anchor.set(0.5);
    // jellyfish.pivot.set(jellyfish.width / 2, jellyfish.height / 2);
    jellyfish.angle = 60;
    jellyfish.scale.set(2);
    jellyfish.input.pixelPerfectClick = true;

    jellyfish.events.onInputDown.add(clicked, this);
    jellyfish.events.onInputOver.add(over, this);
    jellyfish.events.onInputOut.add(out, this);

}

function over(object, pointer) {

    object.alpha = 0.5;

}

function out(object, pointer) {

    object.alpha = 1;

}

function clicked(object, pointer) {

    console.log('boom');

}

function update() {


}

function render() {

    // var p = game.input.getLocalPosition(image);
    // var p = game.input.getLocalPosition(image2);
    var p = game.input.getLocalPosition(jellyfish, game.input.activePointer);


    game.debug.pointInfo(p, 32, 32);
    game.debug.point(p);
    game.debug.text();
    // game.debug.circle(image2.hitArea);

}
