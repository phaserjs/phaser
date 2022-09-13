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

var tileScaleX = 1;
var tileScaleY = 1;
var iter = 0;
var glTexture;
var frame;
var tint;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    //  This is a PoT texture (128x128)
    var texture = this.textures.get('pic');

    frame = texture.get();
    glTexture = texture.source[0].glTexture;

    console.log(texture);

    tint = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha(16777215, 1);
}

function update ()
{
    var pipeline = this.sys.game.renderer.getPipeline('TextureTintPipeline');

    var x = 400;
    var y = 300;
    var textureWidth = 128;
    var textureHeight = 128;
    var displayWidth = 64;
    var displayHeight = 128;
    var flipX = false;
    var flipY = false;
    var displayOriginX = displayWidth * 0.5;
    var displayOriginY = displayHeight * 0.5;

    var frameX = 0;
    var frameY = 0;
    var frameWidth = 64;
    var frameHeight = 128;

    var scrollFactorX = 1;
    var scrollFactorY = 1;
    var scaleX = 1;
    var scaleY = 1;
    var rotation = iter;
    var uOffset = 0;
    var vOffset = 0;

    pipeline.batchTexture(
        null,
        glTexture,
        textureWidth, textureHeight,
        x, y,
        displayWidth, displayHeight,
        scaleX, scaleY,
        rotation,
        flipX, flipY,
        scrollFactorX, scrollFactorY,
        displayOriginX, displayOriginY,
        frameX, frameY, frameWidth, frameHeight,
        tint, tint, tint, tint, false,
        uOffset, vOffset,
        this.cameras.main,
        null
    );

    // tileScaleX = tileScaleY = Math.sin(iter) + 0.2;
    // iter += 0.001;

}
