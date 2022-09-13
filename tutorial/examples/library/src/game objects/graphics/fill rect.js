var config = {
    width: 800,
    height: 600,
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var graphics = this.add.graphics();

    for (var i = 0; i < 11; ++i)
    {
        var color = 0xffff00;
        var alpha = 0.5 + ((i / 10) * 0.5);
    
        graphics.fillStyle(color, alpha);
        graphics.fillRect(32 * i, 32 * i, 256, 256);

    }
}
