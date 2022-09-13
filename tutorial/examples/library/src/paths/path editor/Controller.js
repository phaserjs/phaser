class Controller extends Phaser.Scene {

    constructor ()
    {
        super();
    }

    resize (width, height)
    {
        if (width === undefined) { width = this.game.config.width; }
        if (height === undefined) { height = this.game.config.height; }

        this.cameras.resize(width, height);
    }

}
