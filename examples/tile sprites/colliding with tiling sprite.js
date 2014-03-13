
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var ball;
var tilesprite;
var cursors;

function preload() {

    game.load.image('starfield', 'assets/misc/starfield.jpg');
    game.load.image('ball', 'assets/sprites/pangball.png');

}

function create() {

    game.physics.arcade.gravity.y = 20;

    ball = game.add.sprite(400, 0, 'ball');

    


    game.physics.enable(ball, Phaser.Physics.ARCADE);

    tilesprite = game.add.tileSprite(300, 450, 200, 100, 'starfield');



    game.physics.enable(tilesprite, Phaser.Physics.ARCADE);


    ball.body.collideWorldBounds = true;

    tilesprite.body.collideWorldBounds = true;


    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    game.physics.arcade.collide(ball,tilesprite);

    if (cursors.left.isDown)
    {
        tilesprite.x -= 8;
        tilesprite.tilePosition.x -= 8;
    }
    else if (cursors.right.isDown)
    {
        tilesprite.x += 8;
        tilesprite.tilePosition.x += 8;
    }

    if (cursors.up.isDown)
    {
        tilesprite.tilePosition.y += 8;
    }
    else if (cursors.down.isDown)
    {
        tilesprite.tilePosition.y -= 8;
    }

}

function render() {

    // game.debug.physicsBody(tilesprite);

}