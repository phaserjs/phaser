class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
    }

    create() {
        var print = this.add.text(0, 0, '');

        var layer = this.add.layer();
        this.cameras.main.ignore(layer);

        var circle0 = this.add.circle(400, 300, 50).setStrokeStyle(3, 0x0000ff)
            .setInteractive()
            .on('pointerdown', function() {
                print.text += 'Click circle0\n';
            })

        layer.add(circle0)

        var point = this.add.circle(400, 300, 10, 0xff0000);
    }
}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Demo,
    backgroundColor: 0x444444
};

var game = new Phaser.Game(config);
