class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('elephant', 'assets/sprites/elephant.png');
        this.load.image('coke', 'assets/sprites/cokecan.png');
    }

    create ()
    {
        const elephantLayer = this.add.layer();
        const cokeLayer = this.add.layer();

        for (let i = 0; i < 32; i++)
        {
            let x = Phaser.Math.Between(50, 750);
            let y = Phaser.Math.Between(100, 550);

            elephantLayer.add(this.make.sprite({ x, y, key: 'elephant' }));
        }

        for (let i = 0; i < 32; i++)
        {
            let x = Phaser.Math.Between(50, 750);
            let y = Phaser.Math.Between(100, 550);

            cokeLayer.add(this.make.sprite({ x, y, key: 'coke' }));
        }

        elephantLayer.add(cokeLayer);

        const button1 = this.add.text(10, 10, 'Hide Child Layer', { backgroundColor: '#0000aa', fixedWidth: 210, align: 'center' });
        const button2 = this.add.text(10, 48, 'Hide Parent Layer', { backgroundColor: '#0000aa', fixedWidth: 210, align: 'center' });

        button1.setPadding(0, 8, 0, 8);
        button2.setPadding(0, 8, 0, 8);

        button1.setInteractive();
        button2.setInteractive();

        button1.on('pointerdown', () => {

            cokeLayer.visible = !cokeLayer.visible;

        });

        button2.on('pointerdown', () => {

            elephantLayer.visible = !elephantLayer.visible;

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: Example
};

const game = new Phaser.Game(config);
