
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('car', 'assets/sprites/car90.png');
    game.load.image('baddie', 'assets/sprites/space-baddie.png');

}

var car;
var aliens;

function create() {

    // aliens = game.add.group();

    // for (var i = 0; i < 50; i++)
    // {
    //     var s = aliens.create(game.world.randomX, game.world.randomY, 'baddie');
    //     s.name = 'alien' + s;
    //     s.body.collideWorldBounds = true;
    //     s.body.bounce.setTo(0.8, 0.8);
    //     s.body.velocity.setTo(10 + Math.random() * 40, 10 + Math.random() * 40);
    // }

    car = game.add.sprite(0, 300, 'car');
    car.anchor.setTo(0.5, 0.5);
    car.body.collideWorldBounds = true;
    car.body.bounce.setTo(0.8, 0.8);
    car.body.allowRotation = true;
    car.body.linearDamping = 0.4;

    // car.body.acceleration.x = 10;
    game.input.onDown.add(start, this);

}

var s = 0;

function start() {

    // car.body.velocity.x = 200;
    car.body.acceleration.x = 100;
    s = game.time.now;

}

function update() {

    // if (car.x >= 400 && car.body.velocity.x > 0)
    // {
    //     car.body.velocity.x = 0;
    //     car.body.acceleration.x = 0;
    //     var total = game.time.now - s;
    //     console.log(game.time.physicsElapsed);
    //     console.log('total ms', total, 'px/sec', car.x/(total/1000));
    // }

    // car.body.velocity.x = 0;
    // car.body.velocity.y = 0;
    car.body.angularVelocity = 0;

    car.body.acceleration.x = 0;
    car.body.acceleration.y = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        car.body.angularVelocity = -200;
        // car.body.acceleration.x = -100;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        car.body.angularVelocity = 200;
        // car.body.acceleration.x = 100;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        game.physics.accelerationFromRotation(car.rotation, 400, car.body.acceleration);

        // car.body.acceleration.x = 10;
        // car.body.acceleration.copyFrom(game.physics.velocityFromAngle(car.angle, 30));
        // car.body.velocity.copyFrom(game.physics.velocityFromAngle(car.angle, 300));
    }
    else
    {
        // game.physics.accelerationFromRotation(car.rotation, 10, car.body.acceleration);
    }

    // game.physics.collide(car, aliens);

}

function render() {

    // game.debug.spriteInfo(car, 32, 32);
    game.debug.bodyInfo(car, 16, 24);

}
