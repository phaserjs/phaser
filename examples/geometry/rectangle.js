
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render });

var floor;

function create() {

    floor = new Phaser.Rectangle(0, 550, 800, 50);

}

function render () {

    game.debug.geom(floor,'#0fffff');

}
