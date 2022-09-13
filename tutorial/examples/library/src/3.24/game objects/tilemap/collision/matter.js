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
    map.setCollisionByExclusion([ -1, 0 ]);

    // Convert the layer. Any colliding tiles will be given a Matter body.
    // If a tile has collision shapes from Tiled, these will be loaded. If
    // not, a default rectangle body will be used.
    // The body will be accessible via tile.physics.matterBody.
    this.matter.world.convertTilemapLayer(layer);

    this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);

    // Drop bouncy, Matter balls on pointer down
    this.input.on('pointerdown', function () {
        var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
        for (var i = 0; i < 4; i++)
        {
            var x = worldPoint.x + Phaser.Math.RND.integerInRange(-5, 5);
            var y = worldPoint.y + Phaser.Math.RND.integerInRange(-5, 5);
            var frame = Phaser.Math.RND.integerInRange(0, 5);
            this.matter.add.image(x, y, 'balls', frame, { restitution: 1 });
        }
    }, this);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setScroll(95, 0);

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

    var help = this.add.text(16, 16, 'Left-click to drop balls.\nArrows to scroll.', {
        fontSize: '18px',
        padding: { x: 10, y: 5 },
        backgroundColor: '#000000',
        fill: '#ffffff'
    });
    help.setScrollFactor(0);
}

function update (time, delta)
{
    controls.update(delta);
}
