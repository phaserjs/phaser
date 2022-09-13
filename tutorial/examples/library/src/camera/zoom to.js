class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('map', 'assets/tests/camera/earthbound-scarab.png');
    }

    create ()
    {
        this.cameras.main.setBounds(0, 0, 1024, 2048);

        this.add.image(0, 0, 'map').setOrigin(0);

        this.cameras.main.setZoom(1);
        this.cameras.main.centerOn(0, 0);

        this.text = this.add.text(304, 230).setText('Click to move').setScrollFactor(0);
        this.text.setShadow(1, 1, '#000000', 2);

        let pos = 0;
        this.input.on('pointerdown', function () {

            const cam = this.cameras.main;
            if (pos === 0)
            {
                cam.pan(767, 1096, 2000, 'Power2');
                cam.zoomTo(4, 3000);
                pos++;
            }
            else if (pos === 1)
            {
                cam.pan(703, 1621, 2000, 'Elastic');
                cam.zoomTo(2, 3000);
                pos++;
            }
            else if (pos === 2)
            {
                cam.pan(256, 623, 2000, 'Sine.easeInOut');
                cam.zoomTo(1, 3000);
                pos++;
            }
            else if (pos === 3)
            {
                cam.pan(166, 304, 2000);
                cam.zoomTo(4, 1500);
                pos++;
            }
            else if (pos === 4)
            {
                cam.pan(624, 158, 2000);
                cam.zoomTo(0.5, 3000);
                pos++;
            }
            else if (pos === 5)
            {
                cam.pan(680, 330, 2000);
                pos++;
            }
            else if (pos === 6)
            {
                cam.pan(748, 488, 2000);
                pos++;
            }
            else if (pos === 7)
            {
                cam.pan(1003, 1719, 2000);
                pos = 0;
            }
        }, this);
    }

    update ()
    {
        const cam = this.cameras.main;
        this.text.setText(['Click to move', 'x: ' + cam.scrollX, 'y: ' + cam.scrollY ]);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    scene: [ Example ]
};
const game = new Phaser.Game(config);
