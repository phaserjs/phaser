var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: 0x2d2d2d,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rt;
var graphics;
var offset;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
}

function create ()
{
    rt = this.add.renderTexture(0, 0, 800, 800);

    var atlasTexture = this.textures.get('megaset');

    var frames = atlasTexture.getFrameNames();

    for (var i = 0; i < frames.length; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        rt.drawFrame('megaset', frames[i], x, y);
    }

    graphics = this.add.graphics();

    var cropWidth = 290;
    var cropHeight = 120;

    rt.setCrop(200, 200, cropWidth, cropHeight);

    offset = rt.getTopLeft();

    this.input.on('pointermove', function (pointer) {

        rt.setCrop(
            (pointer.x - offset.x) - cropWidth / 2,
            (pointer.y - offset.y) - cropHeight / 2,
            cropWidth,
            cropHeight
        );
    });
}

function update ()
{
    graphics.clear();
    graphics.lineStyle(1, 0x00ff00);
    graphics.strokeRect(offset.x + rt._crop.x, offset.y + rt._crop.y, rt._crop.width, rt._crop.height);
}
