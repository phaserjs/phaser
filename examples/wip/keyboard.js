
// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('ship', 'assets/sprites/thrust_ship2.png');

}

var ship;
var cursors;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    ship = game.add.sprite(200, 200, 'ship');
    ship.physicsEnabled = true;
    //  We do this because our ship is shaped like a triangle, not a square :)
    ship.body.addPolygon({}, 29, 23  ,  0, 23  ,  14, 1);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
        ship.body.rotateLeft(100);
    }
    else if (cursors.right.isDown)
    {
        ship.body.rotateRight(100);
    }
    else
    {
        ship.body.setZeroRotation();
    }

    if (cursors.up.isDown)
    {
        ship.body.thrust(400);
    }
    else if (cursors.down.isDown)
    {
        ship.body.reverse(400);
    }

}

function render() {

    game.debug.physicsBody(ship.body);

}
