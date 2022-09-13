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

        this.cameras.main.setZoom(4);
        this.cameras.main.centerOn(0, 0);

        const text = this.add.text(304, 230).setText('Click to move').setScrollFactor(0);
        text.setShadow(1, 1, '#000000', 2);

        let pos = 0;

        this.input.on('pointerdown', function () {

            const cam = this.cameras.main;

            if (pos === 0)
            {
                cam.centerOn(767, 1096);
                pos++;
            }
            else if (pos === 1)
            {
                cam.centerOn(703, 1621);
                pos++;
            }
            else if (pos === 2)
            {
                cam.centerOn(256, 623);
                pos++;
            }
            else if (pos === 3)
            {
                cam.centerOn(166, 304);
                pos++;
            }
            else if (pos === 4)
            {
                cam.centerOn(624, 158);
                pos++;
            }
            else if (pos === 5)
            {
                cam.centerOn(680, 330);
                pos++;
            }
            else if (pos === 6)
            {
                cam.centerOn(748, 488);
                pos++;
            }
            else if (pos === 7)
            {
                cam.centerOn(1003, 1719);
                pos = 0;
            }

            text.setText(['Click to move', 'x: ' + cam.scrollX, 'y: ' + cam.scrollY ]);

        }, this);
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
