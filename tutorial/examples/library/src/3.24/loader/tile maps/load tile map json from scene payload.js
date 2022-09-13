var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        pack: {
            files: [
                {
                    type: 'tilemapTiledJSON',
                    key: 'map',
                    url: 'assets/tilemaps/maps/cybernoid.json'
                },
                {
                    type: 'image',
                    key: 'tiles',
                    url: 'assets/tilemaps/tiles/cybernoid.png'
                }
            ]
        },
        create: create,
        update: update
    }
};

var controls;

var game = new Phaser.Game(config);

function create ()
{
    var map = this.make.tilemap({ key: 'map' });

    var tiles = map.addTilesetImage('cybernoid', 'tiles');

    var layer = map.createStaticLayer(0, tiles, 0, 0);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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
}

function update (time, delta)
{
    controls.update(delta);
}
