function preload ()
{
    this.load.image('apple', 'assets/sprites/apple.png');
}

function create()
{
    this.add.text(100, 100, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    let t = this.add.text(100, 200, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    this.add.text(100, 300, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    this.input.once('pointerdown', () => {

        t.destroy();

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
