var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var pos;
var tint;
var frame;
var transformMatrix;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    frame = this.textures.getFrame('pic');

    tint = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha(16777215, 1);

    transformMatrix = new Phaser.GameObjects.Components.TransformMatrix();

    pos = new Phaser.Math.Vector2(0, 0);

    this.tweens.add({
        targets: pos,
        props: {
            x: {
                value: 32,
                ease: 'Linear',
                duration: 6000
            },
            y: {
                value: 472,
                ease: 'Sine.inOut',
                duration: 3000
            }
        },
        yoyo: true,
        repeat: -1
    });
}

function update ()
{
    var pipeline = this.renderer.pipelines.MULTI_PIPELINE;

    for (var i = 0; i < 12; i++)
    {
        pipeline.batchTextureFrame(
            frame,
            i * 64, pos.y - (Math.sin(pos.x + i) * 16),
            tint, 1,
            transformMatrix
        );
    }
}
