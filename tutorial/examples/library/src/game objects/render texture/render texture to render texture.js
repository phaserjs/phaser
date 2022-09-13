var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rt1;
var rt2;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('grid', 'assets/sprites/128x128-v2.png');
}

function create ()
{
    var gridFrame = this.textures.getFrame('grid');
    var gridImage = this.add.image(0, 0, 'grid').setVisible(false).setOrigin(0);

    rt1 = this.add.renderTexture(0, 0, 800, 600);
    rt1.draw(gridFrame, 0, 0);
    rt1.draw(gridImage, 128, 0);
    rt1.draw(gridFrame, 256, 0);

    // rt2 = this.add.renderTexture(200, 200, 800, 600);
    // rt2.draw(bob, 200, 200);
    // rt2.draw(rt2, 0, 0);
}

function update ()
{
    // rt.camera.rotation -= 0.01;
    // rt.clear();
    // rt.draw(graphics, 0, 0);
}
