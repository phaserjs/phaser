class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('soldier', 'assets/animations/soldier.png', 'assets/animations/soldier.json');
        this.load.image('bg', 'assets/skies/grass.jpg');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');
        this.add.text(400, 32, 'Click to pause all animations', { color: '#ffffff' }).setOrigin(0.5, 0);

        this.anims.create({
            key: 'shoot1',
            frames: this.anims.generateFrameNames('soldier', { prefix: 'Soldier_2_shot_up_', start: 1, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'shoot2',
            frames: this.anims.generateFrameNames('soldier', { prefix: 'soldier_3_shoot_front_', start: 1, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        //  Generate some random toy soldiers
        for (let i = 0; i < 32; i++)
        {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(200, 550);
            const rd = Phaser.Math.Between(200, 2000);
            let troop;

            if (i < 16)
            {
                troop = this.add.sprite(x, y, 'soldier', 'Soldier_2_shot_up_1');
                troop.setDepth(y);

                troop.playAfterDelay({ key: 'shoot1', repeatDelay: rd }, rd);
            }
            else
            {
                troop = this.add.sprite(x, y, 'soldier', 'soldier_3_shoot_front_1');
                troop.setDepth(y);

                troop.playAfterDelay({ key: 'shoot2', repeatDelay: rd }, rd);
            }
        }

        this.input.on('pointerdown', function () {
            //  Every single animation in the Animation Manager will be paused:
            if (this.anims.paused)
            {
                this.anims.resumeAll();
            }
            else
            {
                this.anims.pauseAll();
            }
        }, this);
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
