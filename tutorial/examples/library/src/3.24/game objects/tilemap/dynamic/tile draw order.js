var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#bfbfbf',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tileset', 'assets/tilemaps/tiles/tileorder.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/tileorder.json');
}

function create ()
{
    this.cameras.main.scrollX = 120;
    this.cameras.main.scrollY = 80;
    this.cameras.main.zoom = 2;

    var map = this.make.tilemap({ key: 'map' });

    var tiles = map.addTilesetImage('tileset', 'tileset');

    var layer1 = map.createDynamicLayer('floor', tiles, 0, 0);
    var layer2 = map.createDynamicLayer('objects', tiles, 0, 0);

    var renderOrder = 1;

    var text = this.add.text(340, 250, 'Render Order: left-down');

    this.input.on('pointerup', function () {

        renderOrder++;

        if (renderOrder === 4)
        {
            renderOrder = 0;
        }

        layer1.setRenderOrder(renderOrder);
        layer2.setRenderOrder(renderOrder);

        var orders = [
            'right-down',
            'left-down',
            'right-up',
            'left-up'
        ];

        text.setText('Render Order: ' + orders[renderOrder]);

    });
}
