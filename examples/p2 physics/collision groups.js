
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('stars', 'assets/misc/starfield.jpg');
    game.load.spritesheet('ship', 'assets/sprites/humstar.png', 32, 32);
    game.load.image('panda', 'assets/sprites/spinObj_01.png');
    game.load.image('sweet', 'assets/sprites/spinObj_06.png');

}

var ship;
var starfield;
var cursors;

function create() {

    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);

    //  Create our collision groups. One for the player, one for the pandas
    var playerCollisionGroup = game.physics.p2.createCollisionGroup();
    var pandaCollisionGroup = game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    game.physics.p2.updateBoundsCollisionGroup();

    starfield = game.add.tileSprite(0, 0, 800, 600, 'stars');
    starfield.fixedToCamera = true;

    var pandas = game.add.group();
    pandas.enableBody = true;
    pandas.physicsBodyType = Phaser.Physics.P2JS;

    for (var i = 0; i < 4; i++)
    {
        var panda = pandas.create(game.world.randomX, game.world.randomY, 'panda');
        panda.body.setRectangle(40, 40);

        //  Tell the panda to use the pandaCollisionGroup 
        panda.body.setCollisionGroup(pandaCollisionGroup);

        //  Pandas will collide against themselves and the player
        //  If you don't set this they'll not collide with anything.
        //  The first parameter is either an array or a single collision group.
        panda.body.collides([pandaCollisionGroup, playerCollisionGroup]);
    }

    //  Create our ship sprite
    ship = game.add.sprite(200, 200, 'ship');
    ship.scale.set(2);
    ship.smoothed = false;
    ship.animations.add('fly', [0,1,2,3,4,5], 10, true);
    ship.play('fly');

    game.physics.p2.enable(ship, false);
    ship.body.setCircle(28);

    //  Set the ships collision group
    ship.body.setCollisionGroup(playerCollisionGroup);

    //  The ship will collide with the pandas, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
    //  When pandas collide with each other, nothing happens to them.
    ship.body.collides(pandaCollisionGroup, hitPanda, this);

    game.camera.follow(ship);

    cursors = game.input.keyboard.createCursorKeys();

}

function hitPanda(body1, body2) {

    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
    body2.sprite.alpha -= 0.1;

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

    game.debug.text('Collide with the Pandas!', 32, 32);

}