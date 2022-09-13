class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('map', 'assets/tests/camera/earthbound-scarab.png');
        this.load.image('ship', 'assets/sprites/fmship.png');
        this.load.image('mask', 'assets/tests/camera/soft-mask.png');
    }

    create ()
    {
        const maskImage = this.make.image({
            x: 400,
            y: 300,
            key: 'mask',
            add: false
        });

        const mask = maskImage.createBitmapMask();

        this.cameras.main.setMask(mask);

        this.cameras.main.setBounds(0, 0, 1024, 2048);

        this.add.image(0, 0, 'map').setOrigin(0).setScrollFactor(1);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.ship = this.physics.add.image(400.5, 301.3, 'ship');
        // ship = this.add.image(400.5, 301.3, 'ship');

        this.cameras.main.startFollow(this.ship, true, 0.09, 0.09);
        // this.cameras.main.roundPixels = true;

        this.cameras.main.setZoom(4);
    }

    update ()
    {
        this.ship.setVelocity(0);

        if (this.cursors.left.isDown)
        {
            this.ship.setAngle(-90).setVelocityX(-200);
        }
        else if (this.cursors.right.isDown)
        {
            this.ship.setAngle(90).setVelocityX(200);
        }

        if (this.cursors.up.isDown)
        {
            this.ship.setAngle(0).setVelocityY(-200);
        }
        else if (this.cursors.down.isDown)
        {
            this.ship.setAngle(-180).setVelocityY(200);
        }
    }

    updateDirect ()
    {
        if (cursors.left.isDown)
        {
            this.ship.setAngle(-90);
            this.ship.x -= 2.5;
        }
        else if (cursors.right.isDown)
        {
            this.ship.setAngle(90);
            this.ship.x += 2.5;
        }

        if (cursors.up.isDown)
        {
            this.ship.setAngle(0);
            this.ship.y -= 2.5;
        }
        else if (cursors.down.isDown)
        {
            this.ship.setAngle(-180);
            this.ship.y += 2.5;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    scene: [ Example ]
};

const game = new Phaser.Game(config);
