const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1024,
    height: 640,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create
    }
};

const game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mechPNG', 'assets/pics/equality-by-ragnarok.png');
    this.load.image('mechAVIF', 'assets/pics/equality-by-ragnarok.avif');
}

function create ()
{
    // https://jakearchibald.com/2020/avif-has-landed/

    const png = this.add.image(0, 0, 'mechPNG').setScale(0.54).setOrigin(0);
    const avif = this.add.image(0, 0, 'mechAVIF').setScale(0.54).setOrigin(0);

    this.add.text(32, 604, '^ PNG - 2,953 KB');
    this.add.text(992, 604, '^ AVIF - 135 KB').setOrigin(1, 0);

    const debug = this.add.graphics();

    const drawMarker = (x) => {

        debug.clear();
        debug.fillStyle(0x00ff00);
        debug.fillRect(x - 1, 0, 3, 583);
        debug.fillCircle(x, 300, 12);
        debug.fillStyle(0x000000);
        debug.fillTriangle(x - 2, 300 - 6, x - 2, 300 + 6, x - 2 - 6, 300);
        debug.fillTriangle(x + 2, 300 - 6, x + 2, 300 + 6, x + 2 + 6, 300);

    };

    drawMarker(512);

    avif.setCrop(512 * (1 / png.scaleX), 0, 1920, 1080);

    this.input.on('pointermove', (pointer) => {

        drawMarker(pointer.x);

        avif.setCrop(pointer.x * (1 / png.scaleX), 0, 1920, 1080);

    });
}
