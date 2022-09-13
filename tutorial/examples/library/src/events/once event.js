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
        //  This handler will only be called once, no matter how many times the event fires
        this.events.once('addImage', this.handler, this);

        //  We emit the event 3 times, but the handler is only called once
        this.events.emit('addImage');
        this.events.emit('addImage');
        this.events.emit('addImage');
    }

    handler ()
    {
        const x = Phaser.Math.Between(200, 600);
        const y = Phaser.Math.Between(200, 400);

        this.add.image(x, y, 'plush');
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
