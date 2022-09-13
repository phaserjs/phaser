class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        const color = new Phaser.Display.Color();
        for (let i = 0; i < 100; i++)
        {
            color.random(50);
            this.add.rectangle(400, i * 6, 800, 6, color.color);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
