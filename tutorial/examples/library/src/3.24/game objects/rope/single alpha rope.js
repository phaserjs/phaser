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
        this.load.image('bg', 'assets/rope/underwater.jpg');
        this.load.image('snake', 'assets/rope/snake.png');
    }

    create ()
    {
        this.add.image(400, 300, 'bg').setScale(1.1);

        this.rope = this.add.rope(400, 300, 'snake', null, 64);

        //  You can set the alpha of a Rope just like any other Game Object
        //  You can also set the alpha for each vertice in the Rope.
        //  If you do that, this alpha value is multiplied with the vertice alpha.

        this.tweens.add({
            targets: this.rope,
            alpha: 0.1,
            ease: 'sine.inout',
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
    }

    update ()
    {
        this.count += 0.1;

        let points = this.rope.points;

        for (let i = 0; i < points.length; i++)
        {
            points[i].y = Math.sin(i * 0.15 + this.count) * 24;
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
