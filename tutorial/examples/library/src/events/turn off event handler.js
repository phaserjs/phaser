let i = 0;
class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('plush', 'assets/pics/profil-sad-plush.png');
    }

    create ()
    {
        //  Call this handler.
        //  Within the handler it will disable itself after 5 calls.
        this.events.on('addImage', this.handler, this);

        //  Emit the event 10 times
        for (var i = 0; i < 10; i++)
        {
            this.events.emit('addImage');
        }
    }

    handler ()
    {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);

        this.add.image(x, y, 'plush');

        i++;

        if (i === 5)
        {
            this.events.off('addImage', this.handler);
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
