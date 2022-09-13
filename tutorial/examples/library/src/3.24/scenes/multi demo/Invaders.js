class Invaders extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;

        this.left;
        this.right;

        this.ship;

        this.invaders;
        this.mothership;
        this.bullet;

        this.topLeft;
        this.bottomRight;

        this.bulletTimer;
        this.mothershipTimer;

        this.isGameOver = false;

        this.invadersBounds = { x: 12, y: 62, right: 152 };
    }

    create (config)
    {
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        this.physics.world.setBounds(4, 22, 400, 300);

        this.cameras.main.setViewport(this.parent.x, this.parent.y, Invaders.WIDTH, Invaders.HEIGHT);
        this.cameras.main.setBackgroundColor('#000');

        this.createInvaders();

        this.bullet = this.physics.add.image(200, 290, 'invaders.bullet2');

        this.mothership = this.physics.add.image(500, 40, 'invaders.mothership');

        this.ship = this.physics.add.image(200, 312, 'invaders.ship');

        var bg = this.add.image(0, 0, 'invadersWindow').setOrigin(0);

        this.ship.setCollideWorldBounds(true);

        this.physics.add.overlap(this.bullet, this.invaders, this.bulletHit, null, this);
        this.physics.add.overlap(this.bullet, this.mothership, this.bulletHitMothership, null, this);

        this.launchBullet();

        this.mothershipTimer = this.time.addEvent({ delay: 10000, callback: this.launchMothership, callbackScope: this, repeat: -1 });

        this.invaders.setVelocityX(50);
    }

    launchMothership ()
    {
        this.mothership.setVelocityX(-100);
    }

    bulletHit (bullet, invader)
    {
        this.launchBullet();

        invader.body.enable = false;

        this.invaders.killAndHide(invader);

        this.refreshOutliers();
    }

    bulletHitMothership (bullet, mothership)
    {
        this.launchBullet();

        this.mothership.body.reset(500, 40);
    }

    refreshOutliers ()
    {
        var list = this.invaders.getChildren();

        var first = this.invaders.getFirst(true);
        var last = this.invaders.getLast(true);

        for (var i = 0; i < list.length; i++)
        {
            var vader = list[i];

            if (vader.active)
            {
                if (vader.x < first.x)
                {
                    first = vader;
                }
                else if (vader.x > last.x)
                {
                    last = vader;
                }
            }
        }

        if (this.topLeft === null && this.bottomRight === null)
        {
            this.gameOver();
        }

        this.topLeft = first;
        this.bottomRight = last;
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

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

    gameOver ()
    {
        this.invaders.setVelocityX(0);

        this.ship.setVisible(false);

        this.bullet.setVisible(false);

        this.isGameOver = true;
    }

    update ()
    {
        if (this.isGameOver || (this.bottomRight === null && this.topLeft === null))
        {
            return;
        }

        if (this.left.isDown)
        {
            this.ship.body.velocity.x = -400;
        }
        else if (this.right.isDown)
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

        var moveDown = false;

        if (this.bottomRight.body.velocity.x > 0 && this.bottomRight.x >= 390)
        {
            this.invaders.setVelocityX(-50);
            moveDown = true;
        }
        else if (this.topLeft.body.velocity.x < 0 && this.topLeft.x <= 12)
        {
            this.invaders.setVelocityX(50);
            moveDown = true;
        }

        if (moveDown)
        {
            var list = this.invaders.getChildren();
            var lowest = 0;

            for (var i = 0; i < list.length; i++)
            {
                var vader = list[i];

                vader.body.y += 4;

                if (vader.active && vader.body.y > lowest)
                {
                    lowest = vader.body.y;
                }
            }

            if (lowest > 240)
            {
                this.gameOver();
            }
        }
    }

}

Invaders.WIDTH = 408;
Invaders.HEIGHT = 326;
