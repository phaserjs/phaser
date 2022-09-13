class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('isoblocks', 'assets/atlas/isoblocks.png', 'assets/atlas/isoblocks.json');
    }

    create ()
    {
        var frames = this.textures.get('isoblocks').getFrameNames();

        //  blocks are 50x50

        var mapWidth = 40;
        var mapHeight = 40;

        var tileWidthHalf = 20;
        var tileHeightHalf = 12;

        var centerX = (mapWidth / 2) * tileWidthHalf;
        var centerY = -100;

        var blocks = [];

        for (var y = 0; y < mapHeight; y++)
        {
            for (var x = 0; x < mapWidth; x++)
            {
                var tx = (x - y) * tileWidthHalf;
                var ty = (x + y) * tileHeightHalf;

                var block = (x % 2 === 0) ? 'block-123' : 'block-132';

                var tile = this.add.image(centerX + tx, centerY + ty, 'isoblocks', block);

                tile.setData('row', x);
                tile.setData('col', y);

                tile.setDepth(centerY + ty);

                blocks.push(tile);
            }
        }

        this.tweens.add({

            targets: blocks,

            x: function (target, key, value) {

                return (value - (30 - (target.getData('col')) * 4));

            },

            y: function (target, key, value) {

                return (value - (target.getData('row') * 5));

            },

            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: -1,
            duration: 700,
            delay: function (target, key, value, targetIndex, totalTargets, tween) {

                return (target.getData('row') * 60) + (target.getData('col') * 60);

            }
        });

        const cursors = this.input.keyboard.createCursorKeys();

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            zoomIn: cursors.up,
            zoomOut: cursors.down,
            acceleration: 0.04,
            drag: 0.0005,
            maxSpeed: 0.7
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.cameras.main.zoom = 0.62;
        this.cameras.main.scrollX = -110;
    }

    update (time, delta)
    {
        this.controls.update(delta);
    }
}

const config = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    backgroundColor: '#0d0d0d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
