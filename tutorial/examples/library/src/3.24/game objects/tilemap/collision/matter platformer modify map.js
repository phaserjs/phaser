var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            enableSleep: false,
            debug: true
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};


var game = new Phaser.Game(config);
var playerController;
var cursors;
var text;
var cam;
var smoothedControls;
var map;

// Smoothed horizontal controls helper. This gives us a value between -1 and 1 depending on how long
// the player has been pressing left or right, respectively.
var SmoothedHorionztalControl = new Phaser.Class({

    initialize:

    function SmoothedHorionztalControl (speed)
    {
        this.msSpeed = speed;
        this.value = 0;
    },

    moveLeft: function (delta)
    {
        if (this.value > 0) { this.reset(); }
        this.value -= this.msSpeed * delta;
        if (this.value < -1) { this.value = -1; }
        playerController.time.rightDown += delta;
    },

    moveRight: function (delta)
    {
        if (this.value < 0) { this.reset(); }
        this.value += this.msSpeed * delta;
        if (this.value > 1) { this.value = 1; }
    },

    reset: function ()
    {
        this.value = 0;
    }
});

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/matter-platformer-dynamic-example.json');
    this.load.image('kenney_redux_64x64', 'assets/tilemaps/tiles/kenney_redux_64x64.png');
    this.load.spritesheet('player', 'assets/sprites/dude-cropped.png', { frameWidth: 32, frameHeight: 42 });
    this.load.image('box', 'assets/sprites/box-item-boxed.png');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('kenney_redux_64x64');
    var bgLayer = map.createDynamicLayer('Background Layer', tileset, 0, 0);
    var groundLayer = map.createDynamicLayer('Ground Layer', tileset, 0, 0);
    var fgLayer = map.createDynamicLayer('Foreground Layer', tileset, 0, 0).setDepth(1);

    // Set up the layer to have matter bodies. Any colliding tiles will be given a Matter body.
    groundLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(groundLayer);

    this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
    this.matter.world.createDebugGraphic();
    this.matter.world.drawDebug = false;

    cursors = this.input.keyboard.createCursorKeys();
    smoothedControls = new SmoothedHorionztalControl(0.001);

    // The player is a collection of bodies and sensors
    playerController = {
        matterSprite: this.matter.add.sprite(0, 0, 'player', 4),
        blocked: {
            left: false,
            right: false,
            bottom: false
        },
        numTouching: {
            left: 0,
            right: 0,
            bottom: 0
        },
        sensors: {
            bottom: null,
            left: null,
            right: null
        },
        time: {
            leftDown: 0,
            rightDown: 0
        },
        lastJumpedAt: 0,
        speed: {
            run: 5,
            jump: 7
        }
    };

    var M = Phaser.Physics.Matter.Matter;
    var w = playerController.matterSprite.width;
    var h = playerController.matterSprite.height;

    // Move the sensor to player center
    var sx = w / 2;
    var sy = h / 2;

    // The player's body is going to be a compound body.
    var playerBody = M.Bodies.rectangle(sx, sy, w * 0.75, h, { chamfer: { radius: 10 } });
    playerController.sensors.bottom = M.Bodies.rectangle(sx, h, sx, 5, { isSensor: true });
    playerController.sensors.left = M.Bodies.rectangle(sx - w * 0.45, sy, 5, h * 0.25, { isSensor: true });
    playerController.sensors.right = M.Bodies.rectangle(sx + w * 0.45, sy, 5, h * 0.25, { isSensor: true });
    var compoundBody = M.Body.create({
        parts: [
            playerBody, playerController.sensors.bottom, playerController.sensors.left,
            playerController.sensors.right
        ],
        restitution: 0.05 // Prevent body from sticking against a wall
    });

    // There is a "Button Press Sensor" polygon in the "Sensors" layer in Tiled. We can use this to
    // map out the "pressable" hitbox for the button.
    var sensor = map.findObject('Sensors', function (obj) {
        return obj.name === 'Button Press Sensor';
    });
    var center = M.Vertices.centre(sensor.polygon); // Matter places shapes by center of mass
    var sensorBody = this.matter.add.fromVertices(
        sensor.x + center.x, sensor.y + center.y,
        sensor.polygon,
        { isStatic: true, isSensor: true }
    );

    playerController.matterSprite
        .setExistingBody(compoundBody)
        .setFixedRotation() // Sets max inertia to prevent rotation
        .setPosition(32, 1000);

    cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    smoothMoveCameraTowards(playerController.matterSprite);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('player', { start: 4, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    // Use matter events to detect whether the player is touching a surface to the left, right or
    // bottom.

    // Loop over the active colliding pairs and count the surfaces the player is touching.
    this.matter.world.on('collisionstart', function (event) {
        for (var i = 0; i < event.pairs.length; i++)
        {
            var bodyA = event.pairs[i].bodyA;
            var bodyB = event.pairs[i].bodyB;
            if ((bodyA === playerBody && bodyB === sensorBody) ||
                (bodyA === sensorBody && bodyB === playerBody))
            {
                this.matter.world.remove(sensorBody);

                var buttonTile = groundLayer.getTileAt(4, 18);

                // Change the tile to the new index (a "pressed" button tile) and tell the existing
                // matter body to update itself from the Tiled collision data.
                buttonTile.index = 93;
                buttonTile.physics.matterBody.setFromTileCollision();

                // Animate a bridge of new tiles opening up over the lava.
                for (var j = 5; j <= 14; j++)
                {
                    this.time.addEvent({
                        delay: (j - 5) * 50,
                        callback: function (x)
                        {
                            var bridgeTile = groundLayer.putTileAt(12, x, 19);

                            // When creating a new tile that didn't already have a tile body, you
                            // can use the tileBody factory method. See
                            // Phaser.Physics.Matter.TileBody for options. This will default to
                            // adding a body with the Tiled collision data here.
                            this.matter.add.tileBody(bridgeTile);
                        }.bind(this, j)
                    });
                }
            }
        }
    }, this);

    // Use matter events to detect whether the player is touching a surface to the left, right or
    // bottom.

    // Before matter's update, reset the player's count of what surfaces it is touching.
    this.matter.world.on('beforeupdate', function (event) {
        playerController.numTouching.left = 0;
        playerController.numTouching.right = 0;
        playerController.numTouching.bottom = 0;
    });

    // Loop over the active colliding pairs and count the surfaces the player is touching.
    this.matter.world.on('collisionactive', function (event)
    {
        var playerBody = playerController.body;
        var left = playerController.sensors.left;
        var right = playerController.sensors.right;
        var bottom = playerController.sensors.bottom;

        for (var i = 0; i < event.pairs.length; i++)
        {
            var bodyA = event.pairs[i].bodyA;
            var bodyB = event.pairs[i].bodyB;

            if (bodyA === playerBody || bodyB === playerBody)
            {
                continue;
            }
            else if (bodyA === bottom || bodyB === bottom)
            {
                // Standing on any surface counts (e.g. jumping off of a non-static crate).
                playerController.numTouching.bottom += 1;
            }
            else if ((bodyA === left && bodyB.isStatic) || (bodyB === left && bodyA.isStatic))
            {
                // Only static objects count since we don't want to be blocked by an object that we
                // can push around.
                playerController.numTouching.left += 1;
            }
            else if ((bodyA === right && bodyB.isStatic) || (bodyB === right && bodyA.isStatic))
            {
                playerController.numTouching.right += 1;
            }
        }
    });

    // Update over, so now we can determine if any direction is blocked
    this.matter.world.on('afterupdate', function (event) {
        playerController.blocked.right = playerController.numTouching.right > 0 ? true : false;
        playerController.blocked.left = playerController.numTouching.left > 0 ? true : false;
        playerController.blocked.bottom = playerController.numTouching.bottom > 0 ? true : false;
    });

    this.input.on('pointerdown', function () {
        this.matter.world.drawDebug = !this.matter.world.drawDebug;
        this.matter.world.debugGraphic.visible = this.matter.world.drawDebug;
    }, this);

    var lines = [
        'Arrow keys to move. Press "Up" to jump.',
        'Press the button!',
        'Click to toggle rendering Matter debug.'
    ];
    text = this.add.text(16, 16, lines, {
        fontSize: '20px',
        padding: { x: 20, y: 10 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });
    text.setScrollFactor(0);
}

function update (time, delta)
{
    var matterSprite = playerController.matterSprite;
    if (!matterSprite) { return; }

    // Player death

    if (matterSprite.y > map.heightInPixels)
    {
        matterSprite.destroy();
        playerController.matterSprite = null;
        restart.call(this);
        return;
    }

    // Horizontal movement

    var oldVelocityX;
    var targetVelocityX;
    var newVelocityX;

    if (cursors.left.isDown && !playerController.blocked.left)
    {
        smoothedControls.moveLeft(delta);
        matterSprite.anims.play('left', true);

        // Lerp the velocity towards the max run using the smoothed controls. This simulates a
        // player controlled acceleration.
        oldVelocityX = matterSprite.body.velocity.x;
        targetVelocityX = -playerController.speed.run;
        newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -smoothedControls.value);

        matterSprite.setVelocityX(newVelocityX);
    }
    else if (cursors.right.isDown && !playerController.blocked.right)
    {
        smoothedControls.moveRight(delta);
        matterSprite.anims.play('right', true);

        // Lerp the velocity towards the max run using the smoothed controls. This simulates a
        // player controlled acceleration.
        oldVelocityX = matterSprite.body.velocity.x;
        targetVelocityX = playerController.speed.run;
        newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, smoothedControls.value);

        matterSprite.setVelocityX(newVelocityX);
    }
    else
    {
        smoothedControls.reset();
        matterSprite.anims.play('idle', true);
    }

    // Jumping

    // Add a slight delay between jumps since the sensors will still collide for a few frames after
    // a jump is initiated
    var canJump = (time - playerController.lastJumpedAt) > 250;
    if (cursors.up.isDown & canJump && playerController.blocked.bottom)
    {
        matterSprite.setVelocityY(-playerController.speed.jump);
        playerController.lastJumpedAt = time;
    }

    smoothMoveCameraTowards(matterSprite, 0.9);
}

function smoothMoveCameraTowards (target, smoothFactor)
{
    if (smoothFactor === undefined) { smoothFactor = 0; }
    cam.scrollX = smoothFactor * cam.scrollX + (1 - smoothFactor) * (target.x - cam.width * 0.5);
    cam.scrollY = smoothFactor * cam.scrollY + (1 - smoothFactor) * (target.y - cam.height * 0.5);
}

function restart ()
{
    cam.fade(500, 0, 0, 0);
    cam.shake(250, 0.01);

    this.time.addEvent({
        delay: 500,
        callback: function ()
        {
            cam.resetFX();
            this.scene.stop();
            game.scene.start('main');
        },
        callbackScope: this
    });
}
