
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {create: create, update: update, render: render });

var p1;
var p2;
var d = 0;

function create() {

    p1 = new Phaser.Point(200, 300);
    p2 = new Phaser.Point(300, 300);

}

function update() {

    p1.rotate(p2.x, p2.y, game.math.wrapAngle(d), true);

    d++;

}

function render() {

    game.context.fillStyle = 'rgb(255,255,0)';
    game.context.fillRect(p1.x, p1.y, 4, 4);

    game.context.fillStyle = 'rgb(255,0,0)';
    game.context.fillRect(p2.x, p2.y, 4, 4);

}
