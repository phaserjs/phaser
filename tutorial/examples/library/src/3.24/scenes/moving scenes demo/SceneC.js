class SceneC extends Phaser.Scene {

    constructor ()
    {
        super('SceneC');

        this.asteroids = [];

        this.positions = [
            { x: 37, y: 176 },
            { x: 187, y: 66 },
            { x: 177, y: 406 },
            { x: 317, y: 256 },
            { x: 417, y: -10 },
            { x: 487, y: 336 },
            { x: 510, y: 116 },
            { x: 727, y: 186 },
            { x: 697, y: 10 },
            { x: 597, y: 216 },
            { x: 695, y: 366 },
            { x: 900, y: 76 },
            { x: 1008, y: 315 }
        ];
    }

    create ()
    {
        this.cameras.main.setViewport(0, 136, 1024, 465);

        for (let i = 0; i < this.positions.length; i++)
        {
            let pos = this.positions[i];

            let therock = this.add.sprite(pos.x, pos.y, 'asteroid').play('asteroid');

            therock.setData('vx', 0.04);
            therock.setOrigin(0);
            therock.setScale(Phaser.Math.FloatBetween(0.3, 0.6));

            this.asteroids.push(therock);
        }
    }

    update (time, delta)
    {
        for (let i = 0; i < this.asteroids.length; i++)
        {
            let therock = this.asteroids[i];

            therock.x -= therock.getData('vx') * delta;

            if (therock.x <= -100)
            {
                therock.x = 1224;
            }
        }
    }

}
