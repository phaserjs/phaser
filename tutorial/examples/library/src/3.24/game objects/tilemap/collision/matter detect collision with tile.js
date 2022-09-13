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
            enableSleep: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var controls;

function preload ()
{
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tileset-collision-shapes.json');
    this.load.image('kenny_platformer_64x64', 'assets/tilemaps/tiles/kenny_platformer_64x64.png');
}

function create ()
{
    var map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('kenny_platformer_64x64');
    var layer = map.createDynamicLayer(0, tileset, 0, 0);

    // Set colliding tiles before converting the layer to Matter bodies!
    layer.setCollisionByProperty({ collides: true });

    // Convert the layer. Any colliding tiles will be given a Matter body. If a tile has collision
    // shapes from Tiled, these will be loaded. If not, a default rectangle body will be used. The
    // body will be accessible via tile.physics.matterBody.
    this.matter.world.convertTilemapLayer(layer);

    this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cameras.main.setScroll(95, 100);

    // Change the label of the Matter body on the tiles that should kill the bouncing balls. This
    // makes it easier to check Matter collisions.
    layer.forEachTile(function (tile) {
        // In Tiled, the platform tiles have been given a "type" property which is a string
        if (tile.properties.type === 'lava' || tile.properties.type === 'spike')
        {
            tile.physics.matterBody.body.label = 'dangerousTile';
        }
    });

    // Drop bouncy, Matter balls on pointer down. Apply a custom label to the Matter body, so that
    // it is easy to find the collision we care about.
    this.input.on('pointerdown', function () {
        var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
        for (var i = 0; i < 5; i++)
        {
            var x = worldPoint.x + Phaser.Math.RND.integerInRange(-5, 5);
            var y = worldPoint.y + Phaser.Math.RND.integerInRange(-5, 5);
            var frame = Phaser.Math.RND.integerInRange(0, 5);
            this.matter.add.image(x, y, 'balls', frame, { restitution: 1, label: 'ball' });
        }
    }, this);

    // Loop over all the collision pairs that start colliding on each step of the Matter engine.
    this.matter.world.on('collisionstart', function (event) {
        for (var i = 0; i < event.pairs.length; i++)
        {
            // The tile bodies in this example are a mixture of compound bodies and simple rectangle
            // bodies. The "label" property was set on the parent body, so we will first make sure
            // that we have the top level body instead of a part of a larger compound body.
            var bodyA = getRootBody(event.pairs[i].bodyA);
            var bodyB = getRootBody(event.pairs[i].bodyB);

            if ((bodyA.label === 'ball' && bodyB.label === 'dangerousTile') ||
                (bodyB.label === 'ball' && bodyA.label === 'dangerousTile'))
            {
                const ballBody = bodyA.label === 'ball' ? bodyA : bodyB;
                const ball = ballBody.gameObject;

                // A body may collide with multiple other bodies in a step, so we'll use a flag to
                // only tween & destroy the ball once.
                if (ball.isBeingDestroyed)
                {
                    continue;
                }
                ball.isBeingDestroyed = true;

                this.matter.world.remove(ballBody);

                this.tweens.add({
                    targets: ball,
                    alpha: { value: 0, duration: 150, ease: 'Power1' },
                    onComplete: function (ball) { ball.destroy(); }.bind(this, ball)
                });
            }
        }
    }, this);

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };
    controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    var help = this.add.text(16, 16, 'Left-click to drop balls.\nTry dropping the balls on the spikes or lava.', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });
    help.setScrollFactor(0);
}

function update (time, delta)
{
    controls.update(delta);
}

function getRootBody (body)
{
    if (body.parent === body) { return body; }
    while (body.parent !== body)
    {
        body = body.parent;
    }
    return body;
}
