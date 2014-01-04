
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var timer;

function create() {

    game.stage.backgroundColor = '#007236';

    timer = game.time.create(1000, false);

    timer.repeat(1, 10);

    timer.onEvent.add(addSprite, this);

    timer.start();

    // text = game.add.text(0, 0, "Text Above Sprites", { font: "64px Arial", fill: "#00bff3", align: "center" });

}

function addSprite() {

    game.add.sprite(game.world.randomX, game.world.randomY, 'mushroom');

}

function update() {



}

function render() {

    game.debug.renderText(timer.ms, 32, 32);
    // game.debug.renderCameraInfo(game.camera, 32, 32);

}
