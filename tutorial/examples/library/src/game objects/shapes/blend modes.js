var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    this.add.circle(300, 250, 128, 0xff00ff).setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.add.circle(500, 250, 128, 0x00ffff).setBlendMode(Phaser.BlendModes.MULTIPLY);
    this.add.circle(400, 400, 128, 0xffff00).setBlendMode(Phaser.BlendModes.MULTIPLY);
}
