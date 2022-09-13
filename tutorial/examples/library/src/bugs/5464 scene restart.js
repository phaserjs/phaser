function preload ()
{
    this.load.image('apple', 'assets/sprites/apple.png');
    this.load.image('image1', 'assets/sprites/mushroom2.png');
}

function create()
{
    this.add.tileSprite(400, 300, 800, 600, 'apple');

    let x = Phaser.Math.Between(100, 400);

    this.add.text(x, 100, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    this.add.text(x, 200, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    this.add.text(x, 300, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    this.input.once('pointerdown', () => {

        this.scene.restart();

        console.log('restarted');

    });
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
