
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('parsec', 'assets/sprites/parsec.png');
    game.load.image('wizball', 'assets/sprites/wizball.png');
    game.load.image('spaceman', 'assets/sprites/exocet_spaceman.png');

}

var sprite1;
var sprite2;
var sprite3;
var sprite4;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    game.physics.gravity.y = 100;

    sprite1 = game.add.sprite(80, 200);
    sprite1.body.setPolygon(0,0, 60,0, 100,40, 60,80, 0,80);
    sprite1.body.translate(0, 144);
    sprite1.body.immovable = true;
    sprite1.body.allowGravity = false;

    sprite2 = game.add.sprite(450, 300, 'parsec');
    sprite2.body.setPolygon(56, -1  , 10, -5  , 1, -13  , 0, -34  , 55, -60  , 122, -78  , 165, -80  , 214, -74  , 285, -71  , 296, -44  , 298, -12  , 292, -5  , 168, -3);
    sprite2.body.translate(0, 80);
    sprite2.body.immovable = true;
    sprite2.body.allowGravity = false;

    sprite3 = game.add.sprite(230, 400, 'spaceman');
    sprite3.body.setPolygon(34, -172  , 75, -172  , 87, -145  , 121, -52  , 105, -16  , 55, -3  , 9, -19  , 1, -57  , 24, -145);
    sprite3.body.translate(0, 175);
    sprite3.body.immovable = true;
    sprite3.body.allowGravity = false;

    sprite4 = game.add.sprite(380, 100, 'wizball');
    sprite4.body.setCircle(46);
    sprite4.body.collideWorldBounds = true;
    sprite4.body.friction = 0;
    sprite4.body.bounce.setTo(0.9, 0.9);
    sprite4.body.velocity.setTo(100, 100);

}

function update() {

    game.physics.collideArray(sprite4, [ sprite1, sprite2, sprite3 ]);

}

function render() {

    game.debug.renderBodyInfo(sprite4, 32, 32);

    game.debug.renderPhysicsBody(sprite1.body);
    game.debug.renderPhysicsBody(sprite2.body);
    game.debug.renderPhysicsBody(sprite3.body);
    game.debug.renderPhysicsBody(sprite4.body);

}
