var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 1 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);
var text;
var cam;
var map;

function preload ()
{
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/matter-ghost-vertices.json');
    this.load.image('kenney_redux_64x64', 'assets/tilemaps/tiles/kenney_redux_64x64.png');
    this.load.image('ball', 'assets/sprites/mushroom-32x32.png');
}

function create ()
{
    map = this.make.tilemap({ key: 'map' });
    var tileset = map.addTilesetImage('kenney_redux_64x64');
    var layer = map.createDynamicLayer(0, tileset, 0, 0);

    // "Ghost collisions" can happen in physics engines when two colliding bodies are next to one
    // another, e.g. a player trying to walk over two neighboring ground tiles. The order in which
    // the collisions are resolved by the engine can cause "unrealistic" effects, e.g. the player
    // being stopping dead in their tracks on flat ground). See
    // http://www.iforce2d.net/b2dtut/ghost-vertices for more info. When working with tilemaps and
    // Matter, there are a couple ways to mitigate this issue:
    //  - Add chamfer to bodies, i.e. round the edges, or use circular bodies to reduce the impact
    //    of the ghost collisions.
    //  - Map out your level's hitboxes as as a few convex hulls instead of giving each tile a
    //    separate body. You can still use Tiled for this. Create an object layer, and fill it
    //    with shapes, convert those shapes to Matter bodies in Phaser (see below).
    //  - Use a library like hull.js (https://github.com/AndriiHeonia/hull) to automatically figure
    //    out convex hulls from your tiles.

    // Set up the grass tiles to have individual matter bodies.
    layer.setCollisionByProperty({ type: 'grass' });
    this.matter.world.convertTilemapLayer(layer);

    // The stone platform has been mapped as a single, long rectangle in Tiled. See
    // Phaser.Physics.Matter.TileBody#setFromTileCollision for how to parse other Tiled shapes.
    var rect = map.findObject('Collision', function (obj) { return obj.name === 'Stone Platform'; });
    this.matter.add.rectangle(
        rect.x + (rect.width / 2), rect.y + (rect.height / 2),
        rect.width, rect.height,
        { isStatic: true }
    );

    cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cam.setScroll(0, 700);

    this.time.addEvent({
        delay: 500,
        callback: function ()
        {
            var shroom1 = this.matter.add.image(10, 1200, 'ball');
            shroom1.setRectangle();
            shroom1.setFriction(0);
            shroom1.body.force.x = 0.05;
            this.time.addEvent({ delay: 2000, callback: destroyShroom.bind(this, shroom1) });

            var shroom2 = this.matter.add.image(10, 880, 'ball');
            shroom2.setRectangle();
            shroom2.setFriction(0);
            shroom2.body.force.x = 0.05;
            this.time.addEvent({ delay: 2000, callback: destroyShroom.bind(this, shroom2) });
        },
        callbackScope: this,
        loop: true
    });

    this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);
    this.matter.world.createDebugGraphic();

    text = this.add.text(16, 16, 'Ghost Collisions Demo\nGrass: Individual Tile Bodies\nStone: A Single Convex Body', {
        fontSize: '20px',
        padding: { x: 20, y: 10 },
        backgroundColor: '#ffffff',
        fill: '#000000'
    });
    text.setScrollFactor(0);
}

function destroyShroom (shroom)
{
    this.matter.world.remove(shroom);
    shroom.destroy();
}
