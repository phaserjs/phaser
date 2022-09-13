var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 100,
            maxVelocity: 500
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.bitmapFont('hyper', 'assets/fonts/bitmap/hyperdrive.png', 'assets/fonts/bitmap/hyperdrive.xml');
}

function create ()
{
    //  Calling this with no arguments will set the bounds to match the game config width/height
    this.impact.world.setBounds();

    //  Create a Bitmap Text object
    var text = this.add.bitmapText(0, 0, 'hyper', 'Phaser 3', 96);

    //  If you don't set the body as active it won't collide with the world bounds
    //  Set the Game Object we just created as being bound to this physics body
    this.impact.add.body(100, 200).setGameObject(text).setActiveCollision().setVelocity(300, 200).setBounce(1);
}
