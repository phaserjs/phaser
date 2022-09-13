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
    this.load.atlasXML('round', 'assets/atlas/round.png', 'assets/atlas/round.xml');
}

function create ()
{
    var atlasTexture = this.textures.get('round')

    var frames = atlasTexture.getFrameNames();

    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        this.add.image(x, y, 'round', frames[i]);
    }
}
