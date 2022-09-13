var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var originalTexture;
var newTexture;
var context; 

var game = new Phaser.Game(config);

function preload() 
{
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() 
{
    originalTexture = this.textures.get('dude').getSourceImage();

    newTexture = this.textures.createCanvas('dudeNew', originalTexture.width, originalTexture.height);

    context = newTexture.getSourceImage().getContext('2d');

    context.drawImage(originalTexture, 0, 0);

    this.add.image(100, 100, 'dude');
    this.add.image(200, 100, 'dudeNew');

    this.time.addEvent({ delay: 500, callback: hueShift , loop: true });
}

function hueShift ()
{
    var pixels = context.getImageData(0, 0, originalTexture.width, originalTexture.height);

    for (i = 0; i < pixels.data.length / 4; i++)
    {
        processPixel(pixels.data, i * 4, 0.1);
    }

    context.putImageData(pixels, 0, 0);

    newTexture.refresh();
}

function processPixel (data, index, deltahue)
{
    var r = data[index];
    var g = data[index + 1];
    var b = data[index + 2];

    var hsv = Phaser.Display.Color.RGBToHSV(r, g, b);

    var h = hsv.h + deltahue;

    var rgb = Phaser.Display.Color.HSVToRGB(h, hsv.s, hsv.v);

    data[index] = rgb.r;
    data[index + 1] = rgb.g;
    data[index + 2] = rgb.b;
}
