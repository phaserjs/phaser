class Boing extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;

        this.ball;
        this.shadow;
    }

    create ()
    {
        var bg = this.add.image(0, 0, 'boing', 'boing-window').setOrigin(0);

        this.cameras.main.setViewport(this.parent.x, this.parent.y, Boing.WIDTH, Boing.HEIGHT);

        this.physics.world.setBounds(10, 24, 330, 222);

        this.ball = this.physics.add.sprite(100, 32, 'boing', 'boing1').play('boing');
        this.shadow = this.add.image(this.ball.x + 62, this.ball.y - 2, 'boing', 'shadow');

        this.ball.setVelocity(Phaser.Math.Between(40,80), 110);
        this.ball.setBounce(1, 1);
        this.ball.setCollideWorldBounds(true);

        this.events.on('postupdate', this.postUpdate, this);
    }

    postUpdate ()
    {
        this.shadow.setPosition(this.ball.x + 44, this.ball.y - 2);
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

}

Boing.WIDTH = 344;
Boing.HEIGHT = 266;
