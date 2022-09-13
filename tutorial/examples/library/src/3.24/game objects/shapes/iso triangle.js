var config = {
    type: Phaser.WEBGL,
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
    var t1 = this.add.isotriangle(150, 500, 200, 400, false, 0x00b9f2, 0x016fce, 0x028fdf);

    var t2 = this.add.isotriangle(400, 500, 200, 400, true, 0xffe31f, 0xf2a022, 0xf8d80b);

    var t3 = this.add.isotriangle(640, 500, 100, 100, false, 0x8dcb0e, 0x3f8403, 0x63a505);

    this.tweens.add({
        targets: t3,
        height: 300,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });

    this.tweens.add({
        targets: [ t1, t2, t3 ],
        projection: 30,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });
}
