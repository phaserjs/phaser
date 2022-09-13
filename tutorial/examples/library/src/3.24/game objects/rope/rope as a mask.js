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
        this.load.image('dragonball', 'assets/rope/dragonball.png');
        this.load.image('mha', 'assets/rope/mha.jpg');
    }

    create ()
    {
        const rope = this.add.rope(400, 300, 'dragonball', null, 8, false);

        this.rope = rope;

        const bg = this.add.image(300, 300, 'mha');

        bg.setMask(bg.createBitmapMask(rope));

        this.tweens.add({
            targets: bg,
            x: 500,
            ease: 'sine.inOut',
            yoyo: true,
            duration: 2000,
            repeat: -1
        });

        this.add.text(10, 10, 'Using a Rope as a mask', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1);
    }

    update ()
    {
        this.count += 0.1;

        let points = this.rope.points;

        for (let i = 0; i < points.length; i++)
        {
            if (this.rope.horizontal)
            {
                points[i].y = Math.sin(i * 0.5 + this.count) * 10;
            }
            else
            {
                points[i].x = Math.sin(i * 0.5 + this.count) * 20;
            }
        }

        this.rope.setDirty();
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

let game = new Phaser.Game(config);
