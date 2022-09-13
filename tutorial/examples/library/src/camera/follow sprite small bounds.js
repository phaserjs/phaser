class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.moveCam = false;
    }

    preload ()
    {
        // this.load.image('bg', 'assets/pics/the-end-by-iloe-and-made.jpg');
        this.load.image('bg', 'assets/pics/backscroll.png');
        this.load.image('block', 'assets/sprites/crate32.png');
    }

    create ()
    {
        this.cameras.main.setBounds(0, 0, 720 * 2, 176);

        for (let x = 0; x < 2; x++)
        {
            this.add.image(720 * x, 0, 'bg').setOrigin(0);
        }

        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.image(400, 100, 'block');

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(2);
    }

    update ()
    {
        const cam = this.cameras.main;

        this.player.setVelocity(0);

        if (this.moveCam)
        {
            if (this.cursors.left.isDown)
            {
                cam.scrollX -= 4;
            }
            else if (this.cursors.right.isDown)
            {
                cam.scrollX += 4;
            }

            if (this.cursors.up.isDown)
            {
                cam.scrollY -= 4;
            }
            else if (this.cursors.down.isDown)
            {
                cam.scrollY += 4;
            }
        }
        else
        {
            if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-400);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(400);
            }

            if (this.cursors.up.isDown)
            {
                this.player.setVelocityY(-400);
            }
            else if (this.cursors.down.isDown)
            {
                this.player.setVelocityY(400);
            }
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

var moveCam = false;

const game = new Phaser.Game(config);
