class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('tiles', 'assets/tilemaps/tiles/drawtiles-spaced.png');
        this.load.image('car', 'assets/sprites/car90.png');
        this.load.tilemapCSV('map', 'assets/tilemaps/csv/grid.csv');
    }

    create ()
    {
        const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
        const tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
        const layer = map.createLayer(0, tileset, 0, 0);

        layer.setTint(0xff0000, 1, 1, 8, 8);
        layer.setTint(0x00ff00, 9, 1, 8, 8);
        layer.setTint(0x2323ff, 17, 1, 7, 8);
        layer.setTint(0xff00ff, 1, 9, 13, 8);
        layer.setTint(0xffff00, 14, 9, 10, 8);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#1a1a2d',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
