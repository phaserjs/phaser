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
        let i = 0;

        this.events.on('addImage', function () {

            var x = Phaser.Math.Between(100, 700);
            var y = Phaser.Math.Between(100, 500);

            this.add.image(x, y, 'plush');

            i++;

            if (i === 5)
            {
                //  Remove the event after 5 calls.
                //  By not providing a handler it will clear ALL 'addImage' listeners.
                this.events.off('addImage');
            }

        }, this);

        //  Emit the event 10 times
        for (var e = 0; e < 10; e++)
        {
            this.events.emit('addImage');
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
