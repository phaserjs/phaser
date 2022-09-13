class Juggler extends Phaser.Scene {

    constructor (handle, parent)
    {
        super(handle);

        this.parent = parent;
    }

    create ()
    {
        var bg = this.add.image(0, 0, 'jugglerWindow').setOrigin(0);

        this.cameras.main.setViewport(this.parent.x, this.parent.y, Juggler.WIDTH, Juggler.HEIGHT);

        this.add.sprite(100, 22, 'juggler').setOrigin(0).play('juggler');
    }

    refresh ()
    {
        this.cameras.main.setPosition(this.parent.x, this.parent.y);

        this.scene.bringToTop();
    }

}

Juggler.WIDTH = 328;
Juggler.HEIGHT = 226;
