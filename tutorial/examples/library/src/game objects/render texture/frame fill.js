class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('beer', 'assets/sprites/beer.png');
        this.load.image('raster', 'assets/demoscene/large-raster32.png');
    }

    create ()
    {
        const rt = this.add.renderTexture(0, 0, 800, 600);

        rt.fillFrame('raster');
        rt.fillFrame('beer');
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Example
};

const game = new Phaser.Game(config);
