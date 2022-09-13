var config = {
    type: Phaser.AUTO,
    backgroundColor: '#2dab2d',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 160,
        height: 144,
        zoom: 2
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/tests/zoom/title.png');
}

function create ()
{
    this.add.image(0, 0, 'pic').setOrigin(0);

    this.input.on('pointerdown', function () {

        var currentZoom = this.scale.zoom;

        if (currentZoom < 6)
        {
            this.scale.setZoom(currentZoom + 1);
        }

    }, this);
}
