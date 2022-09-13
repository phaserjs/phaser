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

    image.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

    this.input.on('pointerdown', function (pointer) {

        var a = Phaser.Math.Between(0, 359);
        var b = Phaser.Math.Between(0, 359);
        var c = Phaser.Math.Between(0, 359);
        var d = Phaser.Math.Between(0, 359);

        image.setTint(hsv[a].color, hsv[b].color, hsv[c].color, hsv[d].color);

    });

}
