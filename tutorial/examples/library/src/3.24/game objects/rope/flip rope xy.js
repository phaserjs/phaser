class Example extends Phaser.Scene
{
    constructor ()
    {
        super();

        this.rope;
        this.count = 0;
    }

    preload ()
    {
        this.load.image('bg', 'assets/rope/background-woof.png');
        this.load.image('dog', 'assets/rope/doggo.png');
        this.load.atlas('ui', 'assets/rope/ui-icons.png', 'assets/rope/ui-icons.json');
    }

    create ()
    {
        this.add.tileSprite(400, 300, 800, 600, 'bg');

        this.add.text(10, 10, 'Click the arrows to flip', { font: '16px Courier', fill: '#000000' }).setShadow(1, 1, '#ffffff');

        const rope = this.add.rope(400, 300, 'dog', null, 12);

        const hFlip = this.add.image(80, 600-64, 'ui', 'forward-pink').setInteractive();
        const vFlip = this.add.image(800-70, 600-80, 'ui', 'forward-pink').setAngle(-90).setInteractive();

        hFlip.on('pointerdown', () => {

            rope.toggleFlipX();

        });

        vFlip.on('pointerdown', () => {

            rope.toggleFlipY();

        });

        this.rope = rope;
    }

    update ()
    {
        this.count += 0.1;

        let points = this.rope.points;

        for (let i = 0; i < points.length; i++)
        {
            points[i].y = Math.sin(i * 0.5 + this.count) * 10;
        }

        this.rope.setDirty();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000088',
    parent: 'phaser-example',
    scene: Example
};

let game = new Phaser.Game(config);
