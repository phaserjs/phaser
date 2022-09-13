var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('robot', [ 'assets/pics/equality-by-ragnarok.png', 'assets/normal-maps/equality-by-ragnarok_n.png' ]);
}

function create ()
{
    var robot = this.add.image(-300, 0, 'robot').setOrigin(0);

    //  The following just displays the normal map on-screen, so you can see that it loaded properly

    var canvasTexture = this.textures.createCanvas('normalMap', 400, 600);

    canvasTexture.context.drawImage(robot.texture.getDataSourceImage(), -300, 0);

    canvasTexture.refresh();

    var robotMap = this.add.image(400, 0, 'normalMap').setOrigin(0);
}
