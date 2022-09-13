class SceneE extends Phaser.Scene {

    constructor ()
    {
        super('SceneE');

        this.ship;
        this.particles;
        this.emitter;

        this.splineData = [
            50, 300,
            146, 187,
            35, 94,
            180, 40,
            446, 35,
            438, 100,
            337, 150,
            452, 185,
            560, 155,
            641, 90,
            723, 147,
            755, 262,
            651, 271,
            559, 318,
            620, 384,
            563, 469,
            433, 457,
            385, 395,
            448, 334,
            406, 265,
            316, 305,
            268, 403,
            140, 397,
            205, 309,
            204, 240,
            144, 297,
            50, 300
          ];

        this.curve;
    }

    create ()
    {
        this.cameras.main.setViewport(0, 136, 1024, 465);

        this.curve = new Phaser.Curves.Spline(this.splineData);

        let ship = this.add.follower(this.curve, 50, 300, 'space', 'ship');

        ship.startFollow({
            duration: 12000,
            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: -1
        });

        this.particles = this.add.particles('space');

        this.emitter = this.particles.createEmitter({
            frame: 'blue',
            speed: 100,
            lifespan: 2000,
            alpha: 0.6,
            angle: 180,
            scale: { start: 0.7, end: 0 },
            blendMode: 'ADD'
        });

        ship.setDepth(1);

        this.ship = ship;

        this.emitter.startFollow(this.ship);
    }

}
