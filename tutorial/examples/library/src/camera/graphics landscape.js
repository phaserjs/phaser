class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () 
    {
        this.load.image('ship', 'assets/sprites/shmup-ship2.png');
    }

    create () 
    {
        //  The world is 3200 x 600 in size
        this.matter.world.setBounds(0, 0, 3200, 600);
        this.cameras.main.setBounds(0, 0, 3200, 600);

        this.createLandscape();

        //  Add a player ship and camera follow
        this.player = this.matter.add.sprite(1600, 200, 'ship')
            .setFixedRotation()
            .setFrictionAir(0.05)
            .setMass(30);
        this.cameras.main.startFollow(this.player, false, 0.2, 0.2);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update () 
    {
        if (this.cursors.left.isDown)
        {
            this.player.thrustBack(0.1);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.thrust(0.1);
            this.player.flipX = false;
        }
    
        if (this.cursors.up.isDown)
        {
            this.player.thrustLeft(0.1);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.thrustRight(0.1);
        }
    }

    createLandscape ()
    {
        //  Draw a random 'landscape'
        const landscape = this.add.graphics();

        landscape.fillStyle(0x008800, 1);
        landscape.lineStyle(2, 0x00ff00, 1);

        landscape.beginPath();

        const maxY = 550;
        const minY = 400;

        let x = 0;
        let y = maxY;
        let range = 0;

        let up = true;

        landscape.moveTo(0, 600);
        landscape.lineTo(0, 550);

        do
        {
            //  How large is this 'side' of the mountain?
            range = Phaser.Math.Between(20, 100);

            if (up)
            {
                y = Phaser.Math.Between(y, minY);
                up = false;
            }
            else
            {
                y = Phaser.Math.Between(y, maxY);
                up = true;
            }

            landscape.lineTo(x + range, y);

            x += range;

        } while (x < 3100);

        landscape.lineTo(3200, maxY);
        landscape.lineTo(3200, 600);
        landscape.closePath();

        landscape.strokePath();
        landscape.fillPath();
    }

}

const config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                x: 0,
                y: 0
            },
            enableSleeping: true
        }
    },
    scene: [ Example ]
};

const game = new Phaser.Game(config);
