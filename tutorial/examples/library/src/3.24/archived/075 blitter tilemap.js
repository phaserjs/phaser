
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    this.load.tilemap('level3', 'assets/tilemaps/maps/cybernoid.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.spritesheet('tiles', 'assets/tilemaps/tiles/cybernoid.png', 16, 16);

}

var blitter;
var map;
var cam = { x: 0, y: 0 };
var speed = 4;
var cursors;

function create() {

    blitter = this.add.blitter();

    blitter.createMultiple(51 * 38, 'tiles', 0);

    map = new Phaser.Tilemap(this.game, 'level3');

    renderMap();

    cursors = game.input.keyboard.createCursorKeys();

}

function renderMap() {

    //  Rendering offset from camera
    var cx = Phaser.Math.snapToFloor(cam.x, 16) / 16;
    var cy = Phaser.Math.snapToFloor(cam.y, 16) / 16;

    var diffX = cam.x - (cx * 16);
    var diffY = cam.y - (cy * 16);

    var tile = null;

    var w = cx + 51;    //  800/16 = 50 + 1 buffer
    var h = cy + 38;    //  600/16 = 37.5

    var dx = 0;
    var dy = 0;

    for (var y = cy; y < h; y++)
    {
        for (var x = cx; x < w; x++)
        {
            tile = map.getTile(x, y);

            var index = ~~(dx + (dy * 51));

            var bob = blitter.children.getAt(index);

            if (tile)
            {
                bob.x = (dx * 16) - diffX;
                bob.y = (dy * 16) - diffY;
                bob.frame = bob.texture.get(tile.index - 1);
                bob.visible = true;
            }
            else
            {
                bob.visible = false;
            }

            dx++;
        }
        
        dx = 0;
        dy++;
    }

}

function update (delta) {

    if (cursors.up.isDown)
    {
        cam.y -= speed;
        renderMap();
    }
    else if (cursors.down.isDown)
    {
        cam.y += speed;
        renderMap();
    }

    if (cursors.left.isDown)
    {
        cam.x -= speed;
        renderMap();
    }
    else if (cursors.right.isDown)
    {
        cam.x += speed;
        renderMap();
    }

}
