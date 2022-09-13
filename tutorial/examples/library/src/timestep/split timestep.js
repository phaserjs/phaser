class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bullet', 'assets/tests/timer/bullet-bill.png');
        this.load.image('cannon', 'assets/tests/timer/cannon.png');
        this.load.image('ground', 'assets/tests/timer/ground.png');
    }

    create ()
    {
        this.add.image(0, 200, 'ground').setOrigin(0);
        this.add.image(0, 500, 'ground').setOrigin(0);

        this.bullet1 = this.add.image(0, 76, 'bullet').setOrigin(0);
        this.bullet2 = this.add.image(0, 376, 'bullet').setOrigin(0);

        this.speed = 0.5;

        this.timestep = new Phaser.Core.TimeStep(this.game, {
            forceSetTimeOut: true,
            target: 30
        });

        //  You can also optionally set these in the config above:
        // deltaHistory: 0,
        // smoothStep: false

        this.timestep.start((time, delta) => this.steppedUpdate(time, delta));
    }

    update (time, delta)
    {
        this.bullet1.x += this.speed * delta;

        if (this.bullet1.x > 800)
        {
            this.bullet1.x = -100;
        }
    }

    //  Fixed at 30fps, regardless of monitor speed
    steppedUpdate (time, delta)
    {
        this.bullet2.x += this.speed * delta;

        if (this.bullet2.x > 800)
        {
            this.bullet2.x = -100;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#9adaea',
    scene: Example
};

const game = new Phaser.Game(config);
