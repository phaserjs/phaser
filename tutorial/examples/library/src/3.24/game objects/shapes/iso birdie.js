var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var container = this.add.container();

    var leg1 = this.add.isobox(415, 340, 10, 50, 0xffe31f, 0xf2a022, 0xf8d80b);
    var leg2 = this.add.isobox(390, 350, 10, 50, 0xffe31f, 0xf2a022, 0xf8d80b);

    var body1 = this.add.isobox(360, 288, 50, 22, 0x00b9f2, 0x016fce, 0x028fdf);
    var body2 = this.add.isobox(400, 300, 80, 80, 0x00b9f2, 0x016fce, 0x028fdf);

    var beak = this.add.isobox(430, 270, 40, 10, 0xffe31f, 0xf2a022, 0xf8d80b);

    var eye = this.add.isobox(394, 255, 30, 15, 0xffffff, 0xffffff, 0xffffff).setFaces(false, true, false);

    var pupil = this.add.isobox(391, 255, 15, 10, 0x000000, 0x000000, 0x000000).setFaces(false, true, false);

    var wing = this.add.isobox(366, 300, 50, 10, 0x00b9f2, 0x016fce, 0x028fdf);

    container.add([ leg1, leg2, body1, body2, beak, eye, pupil, wing ]);

    container.x -= 400;
    container.y -= 200;
    container.setScale(2);

    this.tweens.add({
        targets: container,
        y: '-=160',
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });

    var pear1 = this.add.isobox(100, 200, 40, 25, 0x8dcb0e, 0x3f8403, 0x63a505);
    var pear2 = this.add.isobox(100, 172, 30, 15, 0x8dcb0e, 0x3f8403, 0x63a505);
    var stalk = this.add.isobox(100, 156, 5, 8, 0x936e06, 0x5d3e00, 0x8c5829);


}