class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('SceneB');

        this.sun;
    }

    create ()
    {
        this.cameras.main.setViewport(0, 136, 1024, 465);

        this.sun = this.add.image(900, 80, 'space', 'sun');
    }

    update (time, delta)
    {
        this.sun.x -= 0.02 * delta;
        this.sun.y += 0.015 * delta;

        if (this.sun.y >= 630)
        {
            this.sun.setPosition(1150, -190);
        }
    }

}
