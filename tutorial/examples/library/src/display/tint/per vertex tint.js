class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
    }

    create ()
    {
        const hsv = Phaser.Display.Color.HSVColorWheel();
        const image = this.add.image(400, 300, 'face');

        image.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

        this.input.on('pointerdown', function (pointer) {

            const a = Phaser.Math.Between(0, 359);
            const b = Phaser.Math.Between(0, 359);
            const c = Phaser.Math.Between(0, 359);
            const d = Phaser.Math.Between(0, 359);

            image.setTint(hsv[a].color, hsv[b].color, hsv[c].color, hsv[d].color);

        });
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
