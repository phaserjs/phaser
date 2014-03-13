
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('stars', 'assets/misc/starfield.jpg');
    game.load.spritesheet('ship', 'assets/sprites/humstar.png', 32, 32);
    game.load.spritesheet('veggies', 'assets/sprites/fruitnveg64wh37.png', 64, 64);

}

var ship;
var starfield;
var cursors;

function create() {

    game.world.setBounds(0, 0, 1600, 1200);

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.defaultRestitution = 0.9;

    starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');
    starfield.fixedToCamera = true;

    veggies = game.add.group();
    veggies.enableBody = true;
    veggies.physicsBodyType = Phaser.Physics.P2JS;

    var vegFrames = [ 1, 3, 4, 8 ];

    for (var i = 0; i < 25; i++)
    {
        var veg = veggies.create(game.world.randomX, game.world.randomY, 'veggies', game.rnd.pick(vegFrames));
        veg.body.setCircle(26);
    }

    ship = game.add.sprite(200, 200, 'ship');
    ship.name = 'ship';
    ship.scale.set(2);
    ship.smoothed = false;
    ship.animations.add('fly', [0,1,2,3,4,5], 10, true);
    ship.play('fly');

    //  Create our physics body - a 28px radius circle. Set the 'false' parameter below to 'true' to enable debugging
    game.physics.p2.enable(ship, false);
    ship.body.setCircle(28);

    game.camera.follow(ship);

    game.physics.p2.setPostBroadphaseCallback(checkVeg, this);

    cursors = game.input.keyboard.createCursorKeys();

}

function checkVeg(body1, body2) {

    //  To explain - the post broadphase event has collected together all potential collision pairs in the world
    //  It doesn't mean they WILL collide, just that they might do.

    //  This callback is sent each collision pair of bodies. It's up to you how you compare them.
    //  If you return true then the pair will carry on into the narrow phase, potentially colliding.
    //  If you return false they will be removed from the narrow phase check all together.

    //  In this simple example if one of the bodies is our space ship, 
    //  and the other body is the green pepper sprite (frame ID 4) then we DON'T allow the collision to happen.
    //  Usually you would use a collision mask for something this simple, but it demonstates use.

    if ((body1.sprite.name === 'ship' && body2.sprite.frame === 4) || (body2.sprite.name === 'ship' && body1.sprite.frame === 4))
    {
        return false;
    }

    return true;

}

function update() {

    ship.body.setZeroVelocity();

    if (cursors.left.isDown)
    {
        ship.body.moveLeft(200);
    }
    else if (cursors.right.isDown)
    {
        ship.body.moveRight(200);
    }

    if (cursors.up.isDown)
    {
        ship.body.moveUp(200);
    }
    else if (cursors.down.isDown)
    {
        ship.body.moveDown(200);
    }

    if (!game.camera.atLimit.x)
    {
        starfield.tilePosition.x += (ship.body.velocity.x * 16) * game.time.physicsElapsed;
    }

    if (!game.camera.atLimit.y)
    {
        starfield.tilePosition.y += (ship.body.velocity.y * 16) * game.time.physicsElapsed;
    }

}

function render() {

    game.debug.text('World bodies: ' + game.physics.p2.total, 32, 32);

}