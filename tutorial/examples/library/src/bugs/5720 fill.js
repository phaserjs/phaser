function preload ()
{
    this.load.image('apple', 'assets/sprites/apple.png');
}

function create()
{
    this.add.text(10, 10, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    this.add.circle(200, 300, 100, 0x6666ff);
    this.add.rectangle(300, 300, 64, 128, 0x6666ff);
    var t1 = this.add.isobox(150, 500, 200, 400, 0x00b9f2, 0x016fce, 0x028fdf);
    var t3 = this.add.isotriangle(640, 500, 100, 100, false, 0x8dcb0e, 0x3f8403, 0x63a505);
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
  };

const game = new Phaser.Game(config);
