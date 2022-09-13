class Example1 extends Phaser.Scene
{
    constructor ()
    {
        super('Example1');
    }

    create ()
    {
        this.t = this.add.text(32, 32, 'Example 1');

        this.start = this.time.now;

        this.input.once('pointerdown', () => {
            this.scene.start('Example2');
        });
    }

    update ()
    {
        this.t.setText([ 'E1', this.start, this.time.now ]);
    }
}

class Example2 extends Phaser.Scene
{
    constructor ()
    {
        super('Example2');
    }

    create ()
    {
        this.t = this.add.text(32, 32, 'Example 2');

        this.start = this.time.now;

        this.input.once('pointerdown', () => {
            this.scene.start('Example1');
        });
    }

    update ()
    {
        this.t.setText([ 'E2', this.start, this.time.now ]);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Example1, Example2 ]
};

let game = new Phaser.Game(config);
