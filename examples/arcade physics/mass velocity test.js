
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('car', 'assets/sprites/car90.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');

}

var car;
var aliens;

function create() {

    aliens = game.add.group();

    game.physics.arcade.gravity.y = 100;

    for (var i = 0; i < 50; i++)
    {
        var s = aliens.create(game.world.randomX, game.world.randomY, 'baddie');
        game.physics.enable(s, Phaser.Physics.ARCADE);
        s.name = 'alien' + s;
        s.body.collideWorldBounds = true;
        s.body.bounce.setTo(0.8, 0.8);
        s.body.linearDamping = 0;
        s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    }

    car = game.add.sprite(400, 300, 'car');
    car.name = 'car';
    car.anchor.setTo(0.5, 0.5);
    game.physics.enable(car, Phaser.Physics.ARCADE);
    car.body.collideWorldBounds = true;
    // car.body.bounce.setTo(0.8, 0.8);
    car.body.allowRotation = true;
    // car.body.immovable = true;
    // car.body.minBounceVelocity = 0;

}

function update() {

    game.physics.arcade.collide(car, aliens);

    car.body.velocity.x = 0;
    car.body.velocity.y = 0;
    car.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        car.body.angularVelocity = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        car.body.angularVelocity = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        car.body.velocity.copyFrom(game.physics.arcade.velocityFromAngle(car.angle, 300));
    }

}

function render() {

    // for (var i = 0; i < aliens._container.children.length; i++)
    // {
    //     game.debug.polygon(aliens._container.children[i].body.polygons);
    // }

    // game.debug.polygon(car.body.polygons);

    // game.debug.bodyInfo(aliens._container.children[0], 32, 32);
    // game.debug.bodyInfo(aliens._container.children[0], 32, 32);

    // game.debug.bodyInfo(car, 16, 24);
    // game.debug.bodyInfo(aliens.getFirstAlive(), 16, 24);

}
