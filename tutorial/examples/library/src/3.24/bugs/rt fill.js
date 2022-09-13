var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
    this.load.image('grid', 'assets/pics/uv-grid-diag.png');
}

function create ()
{
    rt = this.add.renderTexture(100, 100, 512, 256);

    rt.draw('grid', 0, 0);

    rt.fill(0xff00ff, 1, 17, 33, 333, 77);

    rt.draw('logo', 17, 33);

}
