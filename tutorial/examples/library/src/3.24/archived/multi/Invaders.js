class Invaders extends Phaser.Scene {

    constructor ()
    {
        super('invaders');

        this.controller;

        this.ship;

        this.invaders;
        this.mothership;
        this.bullet;

        this.topLeft;
        this.bottomRight;

        this.bulletTimer;

        this.invadersBounds = { x: 12, y: 48, right: 152 };
    }

    create (config)
    {
        this.controller = this.scene.get('controller');

        this.physics.world.setBounds(0, 0, 400, 300);
        this.cameras.main.setViewport(config.x, config.y, 400, 300).setBackgroundColor('#000');

        this.createInvaders();

        this.bullet = this.physics.add.image(200, 290, 'invaders.bullet2');

        this.mothership = this.add.image(400, 18, 'invaders.mothership');

        this.ship = this.physics.add.image(200, 290, 'invaders.ship');

        this.ship.setCollideWorldBounds(true);

        this.physics.add.overlap(this.bullet, this.invaders, this.bulletHit, null, this);

        this.launchBullet();

        this.invaders.setVelocityX(50);
    }

    bulletHit (bullet, invader)
    {
        this.launchBullet();

        invader.body.enable = false;

        this.invaders.killAndHide(invader);
    }

    launchBullet ()
    {
        this.bullet.body.reset(this.ship.x, this.ship.y);

        this.bullet.body.velocity.y = -400;
    }

    createInvaders ()
    {
        this.invaders = this.physics.add.group();

        var x = this.invadersBounds.x;
        var y = this.invadersBounds.y;

        for (var i = 0; i < 10; i++)
        {
            this.invaders.create(x, y, 'invaders.invader1').setTint(0xff0000).play('invader1');

            x += 26;
        }

        x = this.invadersBounds.x;
        y += 28

        for (var i = 0; i < 16; i++)
        {
            this.invaders.create(x, y, 'invaders.invader2').setTint(0x00ff00).play('invader2');

            x += 33;

            if (i === 7)
            {
                x = this.invadersBounds.x;
                y += 28;
            }
        }

        x = this.invadersBounds.x;
        y += 28

        for (var i = 0; i < 14; i++)
        {
            this.invaders.create(x, y, 'invaders.invader3').setTint(0x00ffff).play('invader3');

            x += 38;

            if (i === 6)
            {
                x = this.invadersBounds.x;
                y += 28;
            }
        }

        //  We can use these markers to work out where the whole Group is and how wide it is
        this.topLeft = this.invaders.getFirst(true);
        this.bottomRight = this.invaders.getLast(true);
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
        else
        {
            this.ship.body.velocity.x = 0;
        }

        //  Bullet bounds
        if (this.bullet.y < -32)
        {
            this.launchBullet();
        }

        //  Invaders bounds
        if (this.bottomRight.body.velocity.x > 0 && this.bottomRight.x >= 380)
        {
            this.invaders.setVelocityX(-50);
        }
        else if (this.topLeft.body.velocity.x < 0 && this.topLeft.x <= 12)
        {
            this.invaders.setVelocityX(50);
        }
    }

}
