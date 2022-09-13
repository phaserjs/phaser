var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('face', 'assets/pics/bw-face.png');
}

function create ()
{
    var hsv = Phaser.Display.Color.HSVColorWheel();

    var image = this.add.image(400, 300, 'face');

    // image.setTint(0xff00ff);
    image.setTint(0xff0000);
    // image.setTint(0x00ff00);
    // image.setTint(0x0000ff);

    this.input.on('pointerdown', function (pointer) {

        var i = Phaser.Math.Between(0, 359);

        image.setTint(hsv[i].color);

    });

}
