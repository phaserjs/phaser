class Asteroids extends Phaser.Scene {

    constructor ()
    {
        super('asteroids');

        this.controller;

        this.ship;

        this.rocks;
        this.bullets;

        this.bulletTimer;
    }

    create (config)
    {
        this.controller = this.scene.get('controller');

        this.physics.world.setBounds(0, 0, 400, 300);
        this.cameras.main.setViewport(config.x, config.y, 400, 300).setBackgroundColor('#000');
    }

    bulletHit (bullet, invader)
    {
    }

    launchBullet ()
    {
    }

    createInvaders ()
    {
        this.rocks = this.physics.add.group();

    }

    update ()
    {
        if (this.controller.left.isDown)
        {
            this.ship.body.velocity.x = -400;
        }
        else if (this.controller.right.isDown)
        {
            this.ship.body.velocity.x = 400;
        }
    }

}
