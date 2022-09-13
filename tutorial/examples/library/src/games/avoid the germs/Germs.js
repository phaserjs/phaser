import Germ from './Germ.js';

export default class Germs extends Phaser.Physics.Arcade.Group
{
    constructor (world, scene)
    {
        super(world, scene);

        this.classType = Germ;

        this.germConfig = [
            { animation: 'germ1', speed: 60 },
            { animation: 'germ2', speed: 90 },
            { animation: 'germ3', speed: 120 },
            { animation: 'germ4', speed: 180 }
        ];
    }

    start ()
    {
        let germ1 = new Germ(this.scene, 100, 100, 'germ1');
        let germ2 = new Germ(this.scene, 700, 600, 'germ1');
        let germ3 = new Germ(this.scene, 200, 400, 'germ1');

        this.add(germ1, true);
        this.add(germ2, true);
        this.add(germ3, true);

        germ1.start(1000);
        germ2.start(2000);
        germ3.start();

        this.timedEvent = this.scene.time.addEvent({ delay: 2000, callback: this.releaseGerm, callbackScope: this, loop: true });
    }

    stop ()
    {
        this.timedEvent.remove();

        this.getChildren().forEach((child) => {

            child.stop();

        });
    }

    releaseGerm ()
    {
        const x = Phaser.Math.RND.between(0, 800);
        const y = Phaser.Math.RND.between(0, 600);

        let germ;

        let config = Phaser.Math.RND.pick(this.germConfig);

        this.getChildren().forEach((child) => {

            if (child.anims.getName() === config.animation && !child.active)
            {
                //  We found a dead matching germ, so resurrect it
                germ = child;
            }

        });

        if (germ)
        {
            germ.restart(x, y);
        }
        else
        {
            germ = new Germ(this.scene, x, y, config.animation, config.speed);

            this.add(germ, true);

            germ.start();
        }
    }
}
