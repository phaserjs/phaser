class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');

        this.nebula;
    }

    create ()
    {
        this.cameras.main.setViewport(0, 136, 1024, 465);

        this.nebula = this.add.image(300, 250, 'space', 'nebula');
    }

    update (time, delta)
    {
        this.nebula.rotation += 0.00006 * delta;
    }

}
