class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.spritesheet('invader', 'assets/tests/invaders/invader1.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('boom', 'assets/sprites/explosion.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });
    }

    create ()
    {
        this.add.text(400, 32, 'Click the invaders to destroy them', { color: '#00ff00' }).setOrigin(0.5, 0);

        var config1 = {
            key: 'move',
            frames: 'invader',
            frameRate: 4,
            repeat: -1
        };

        var config2 = {
            key: 'explode',
            frames: 'boom',
            hideOnComplete: true
        };

        this.anims.create(config1);
        this.anims.create(config2);

        var colors = [ 0xef658c, 0xff9a52, 0xffdf00, 0x31ef8c, 0x21dfff, 0x31aade, 0x5275de, 0x9c55ad, 0xbd208c ];

        //  Create a load of random sprites
        for (var i = 0; i < 128; i++)
        {
            var x = Phaser.Math.Between(50, 750);
            var y = Phaser.Math.Between(100, 550);

            var ship = this.add.sprite(x, y, 'invader');

            ship.play('move');

            ship.setTint(Phaser.Utils.Array.GetRandom(colors));

            ship.setInteractive();

            ship.once('pointerdown', function () {

                this.clearTint();

                //  Sprite will have visible = false set when the animation finishes repeating because of 'hideOnComplete' property
                this.play('explode');

            });
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
