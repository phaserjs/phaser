class SceneD extends Phaser.Scene {

    constructor ()
    {
        super('SceneD');

        this.planet;
    }

    create ()
    {
        this.cameras.main.setViewport(0, 136, 1024, 465);

        this.planet = this.add.image(200, 380, 'space', 'planet');
    }

    update (time, delta)
    {
        this.planet.x += 0.01 * delta;

        if (this.planet.x >= 1224)
        {
            this.planet.x = -200;
        }
    }

}
