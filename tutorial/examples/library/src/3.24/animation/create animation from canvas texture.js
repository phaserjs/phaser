var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var framesPerRow = 8;
    var frameTotal = 32;

    //  Create a CanvasTexture that is 256 x 128 in size.
    //  The frames will be 32 x 32, which means we'll fit in 8 x 4 of them to our texture size, for a total of 32 frames.
    var canvasFrame = this.textures.createCanvas('dynamicFrames', 256, 128);

    var radius = 0;
    var radiusInc = 16 / frameTotal;

    var x = 0;
    var y = 0;
    var ctx = canvasFrame.context;

    ctx.fillStyle = '#ffff00';

    for (var i = 1; i <= frameTotal; i++)
    {
        //  Draw an arc to the CanvasTexture
        ctx.beginPath();
        ctx.arc(x + 16, y + 16, Math.max(1, radius), 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();

        //  Now we add a frame to the CanvasTexture.
        //  See the docs for the arguments.
        canvasFrame.add(i, 0, x, y, 32, 32);

        x += 32;
        radius += radiusInc;

        //  Hit the end of the row? Wrap it around.
        if (i % framesPerRow === 0)
        {
            x = 0;
            y += 32;
        }
    }

    //  Call this if running under WebGL, or you'll see nothing change
    canvasFrame.refresh();

    //  Display the whole of our freshly baked sprite sheet
    this.add.image(0, 0, 'dynamicFrames', '__BASE').setOrigin(0);

    //  Let's create an animation from the new frames
    this.anims.create({
        key: 'pulse',
        frames: this.anims.generateFrameNumbers('dynamicFrames', { start: 1, end: frameTotal }),
        frameRate: 28,
        repeat: -1,
        yoyo: true
    });

    //  Add a bunch of Sprites that all use the same base texture and animation
    for (var i = 0; i < 50; i++)
    {
        var ball = this.add.sprite(8 + i * 16, 164, 'dynamicFrames').play('pulse');

        this.tweens.add({
            targets: ball,
            y: 584,
            duration: 2000,
            ease: 'Quad.easeInOut',
            delay: i * 30,
            yoyo: true,
            repeat: -1
        });
    }
}
