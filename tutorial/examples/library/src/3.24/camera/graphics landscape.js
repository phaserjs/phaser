var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            setBounds: {
                x: 0,
                y: 0,
                width: 3200,
                height: 600,
                thickness: 32
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
            player: null,
            cursors: null,
            createLandscape: createLandscape
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/sprites/shmup-ship2.png');
}

function create ()
{
    //  The world is 3200 x 600 in size
    this.cameras.main.setBounds(0, 0, 3200, 600);

    this.createLandscape();

    //  Add a player ship

    this.player = this.impact.add.sprite(1600, 200, 'ship');
    this.player.setMaxVelocity(1000).setFriction(400, 200).setPassiveCollision();

    this.cursors = this.input.keyboard.createCursorKeys();
}

function update()
{
    if (this.cursors.left.isDown)
    {
        this.player.setAccelerationX(-800);
        this.player.flipX = true;
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setAccelerationX(800);
        this.player.flipX = false;
    }
    else
    {
        this.player.setAccelerationX(0);
    }

    if (this.cursors.up.isDown)
    {
        this.player.setAccelerationY(-800);
    }
    else if (this.cursors.down.isDown)
    {
        this.player.setAccelerationY(800);
    }
    else
    {
        this.player.setAccelerationY(0);
    }

    //  Position the center of the camera on the player
    //  We -400 because the camera width is 800px and
    //  we want the center of the camera on the player, not the left-hand side of it
    this.cameras.main.scrollX = this.player.x - 400;
}

function createLandscape ()
{
    //  Draw a random 'landscape'

    var landscape = this.add.graphics();

    landscape.fillStyle(0x008800, 1);
    landscape.lineStyle(2, 0x00ff00, 1);

    landscape.beginPath();

    var maxY = 550;
    var minY = 400;

    var x = 0;
    var y = maxY;
    var range = 0;

    var up = true;

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
