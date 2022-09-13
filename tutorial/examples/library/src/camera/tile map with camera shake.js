this.controls;

class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('tiles', 'assets/tilemaps/tiles/cybernoid.png');
        this.load.tilemapTiledJSON('map', 'assets/tilemaps/maps/cybernoid.json');
    }

    create ()
    {
        const map = this.make.tilemap({ key: 'map' });
        const tiles = map.addTilesetImage('cybernoid', 'tiles');
        const layer = map.createLayer(0, tiles, 0, 0);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        const cursors = this.input.keyboard.createCursorKeys();
        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.5
        };
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

        //  Every time you click, shake the camera
        this.input.on('pointerdown', function () {
            this.cameras.main.shake(500);
        }, this);
    }

    update (time, delta)
    {
        this.controls.update(delta);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    pixelArt: true,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
