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
        this.load.image('patchouli', 'assets/rope/patchouli.png');
        this.load.image('wwy', 'assets/rope/weathering-with-you.jpg');
    }

    create ()
    {
        const rope = this.add.rope(400, 300, 'wwy', null, 16).setScale(0.7);

        const mask = this.make.image({ x: 200, y: 300, key: 'patchouli' }, false);

        rope.setMask(rope.createBitmapMask(mask));

        this.rope = rope;

        this.tweens.add({
            targets: mask,
            x: 600,
            ease: 'sine.inOut',
            yoyo: true,
            duration: 2000,
            repeat: -1
        });

        this.add.text(10, 10, 'A Rope with a mask', { font: '16px Courier', fill: '#ffffff' }).setShadow(1, 1);
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
