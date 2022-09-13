var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('grid', 'assets/pics/uv-grid-diag.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
}

function create ()
{
    this.add.image(400, 300, 'grid');

    var image0 = this.add.image(0, -200, 'logo').setBlendMode(Phaser.BlendModes.ADD);
    var image1 = this.add.image(0, 0, 'logo').setBlendMode(Phaser.BlendModes.DIFFERENCE);
    var image2 = this.add.image(0, 200, 'logo').setBlendMode(Phaser.BlendModes.COLOR_DODGE);

    var container = this.add.container(400, 300, [ image0, image1, image2 ]);

    //  If the Container has a blend mode set it will override the children
    //  Un-comment the following line and the child blend modes will be replaced by the Containers

    // container.setBlendMode(Phaser.BlendModes.MULTIPLY);
}
