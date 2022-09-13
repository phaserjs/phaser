var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d88',
    pixelArt: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var glTexture;
var tint;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/shocktroopers-lulu2.png');
}

function create ()
{
    //  This is a canvas non-PoT texture (133 x 188)
    var ts = this.make.tileSprite({ key: 'pic' }, false);

    // document.body.appendChild(ts.canvasBuffer);

    glTexture = ts.tileTexture;

    tint = Phaser.Renderer.WebGL.Utils.getTintAppendFloatAlpha(16777215, 1);

    this.add.image(600, 300, 'pic');

    // Texture
    // 233.5 206 233.5 394 366.5 394 366.5 206

    // Sprite
    // 533 206 533 394 666 394 666 206
}

function update ()
{
    var pipeline = this.sys.game.renderer.getPipeline('TextureTintPipeline');

    var x = 300;
    var y = 300;
    var textureWidth = 133;
    var textureHeight = 188;
    var displayWidth = 133;
    var displayHeight = 188;
    var flipX = false;
    var flipY = false;
    var displayOriginX = Math.floor(displayWidth * 0.5);
    var displayOriginY = Math.floor(displayHeight * 0.5);
    var frameX = 0;
    var frameY = 0;
    var frameWidth = 133;
    var frameHeight = 188;
    var scrollFactorX = 1;
    var scrollFactorY = 1;
    var scaleX = 2;
    var scaleY = 2;
    var rotation = 0;
    var uOffset = 0.5;
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
        tint, tint, tint, tint,
        uOffset, vOffset,
        this.cameras.main,
        null
    );
}
