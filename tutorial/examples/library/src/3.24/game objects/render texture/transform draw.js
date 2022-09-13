var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bunny', 'assets/sprites/bunny.png');
}

function create ()
{
    //  Create a Render Texture at 0x0 which is 800x600 in size
    var rt = this.add.renderTexture(0, 0, 800, 600);

    rt.camera.setAngle(20);
    rt.camera.setZoom(2);
    rt.camera.setPosition(450, 350);

    rt.drawFrame('bunny');
}
