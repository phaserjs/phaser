var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var texture;

var game = new Phaser.Game(config);

function create ()
{
    texture = this.textures.createCanvas('gradient', 16, 256);

    //  We can access the underlying Canvas context like this:
    var grd = texture.context.createLinearGradient(0, 0, 0, 256);

    grd.addColorStop(0, '#8ED6FF');
    grd.addColorStop(1, '#004CB3');

    texture.context.fillStyle = grd;
    texture.context.fillRect(0, 0, 16, 256);

    //  Call this if running under WebGL, or you'll see nothing change
    texture.refresh();

    //  Add a bunch of images that all use the same texture
    for (var i = 0; i < 64; i++)
    {
        var image = this.add.image(8 + i * 16, 0, 'gradient');

        this.tweens.add({
            targets: image,
            y: 650,
            duration: 2000,
            ease: 'Quad.easeInOut',
            delay: i * 62.5,
            yoyo: true,
            repeat: -1
        });
    }

    this.time.addEvent({ delay: 4000, callback: updateTexture, callbackScope: this, loop: true });
}

function updateTexture ()
{
    var grd = texture.context.createLinearGradient(0, 0, 0, 256);

    grd.addColorStop(0, generateHexColor());
    grd.addColorStop(1, generateHexColor());

    texture.context.fillStyle = grd;
    texture.context.fillRect(0, 0, 16, 256);

    //  Call this if running under WebGL, or you'll see nothing change
    texture.refresh();
}

function generateHexColor ()
{
    return '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16);
}
