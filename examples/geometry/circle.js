
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, render: render });

var circle;
var floor;

function create() {

    circle = new Phaser.Circle(game.world.centerX, 100,64);

}

function render () {

    game.debug.renderCircle(circle,'#cfffff');
    game.debug.renderText('Diameter : '+circle.diameter,50,200);
    game.debug.renderText('Circumference : '+circle.circumference(),50,230);

}
