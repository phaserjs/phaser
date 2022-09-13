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

var rt;
var bitmaptext;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create ()
{
    bitmaptext = this.add.bitmapText(0, 0, 'desyrel', 'PHASER 3\nRender Texture', 64);

    bitmaptext.setVisible(false);

    rt = this.add.renderTexture(0, 0, 800, 600);
}

function update ()
{
    rt.camera.rotation -= 0.01;

    rt.clear();

    rt.draw(bitmaptext, 300, 400);
}
