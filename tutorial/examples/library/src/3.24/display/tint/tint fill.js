var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#222288',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('lulu', 'assets/pics/shocktroopers-lulu2.png');
}

function create ()
{
    var image1 = this.add.image(140, 300, 'lulu').setScale(2).setInteractive({ pixelPerfect: true });
    var image2 = this.add.image(140 + 260, 300, 'lulu').setScale(2).setInteractive({ pixelPerfect: true });
    var image3 = this.add.image(140 + 260 + 260, 300, 'lulu').setScale(2).setInteractive({ pixelPerfect: true });

    this.add.text(20, 20).setColor('#ffffff').setText('Click sprites to toggle tint mode');

    this.add.text(30, 500).setColor('#ffffff').setText('Single Tint Fill');
    this.add.text(290, 500).setColor('#ffffff').setText('Multi Tint Fill');
    this.add.text(550, 500).setColor('#ffffff').setText('Merge Tint Fill');

    image1.on('pointerdown', function () {

        if (this.isTinted)
        {
            this.clearTint();
        }
        else
        {
            this.setTintFill(0xffffff);
        }

    });

    image2.on('pointerdown', function () {

        if (this.isTinted)
        {
            this.clearTint();
        }
        else
        {
            this.setTintFill(0xffff00, 0xffff00, 0xff0000, 0xff0000);
        }

    });

    image3.on('pointerdown', function () {

        if (this.isTinted)
        {
            this.clearTint();
        }
        else
        {
            this.setTint(0xff00ff, 0xff0000, 0x00ff00, 0x0000ff);
        }

    });

}
