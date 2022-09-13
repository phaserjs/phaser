var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var originalTexture;
var newTexture;
var context;

var dude;
var dude2;

function preload() 
{
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() 
{
    originalTexture = this.textures.get('dude').getSourceImage();

    var newTexture = this.textures.createCanvas('dude_new', originalTexture.width, originalTexture.height);

    context = newTexture.getSourceImage().getContext('2d');

    context.drawImage(originalTexture, 0, 0);

    dude = this.add.image(100, 100, 'dude');
    dude2 = this.add.image(200, 100, 'dude_new');

    createSilhouette();
}

function createSilhouette()
{
    var pixels = context.getImageData(0, 0, originalTexture.width, originalTexture.height);

    for (i = 0; i < pixels.data.length / 4; i++)
    {
        processPixel(pixels.data, i * 4, 0.1);
    }

    context.putImageData(pixels, 0, 0);
}

function processPixel(data, index)
{
    data[index] = 255;
    data[index + 1] = 0;
    data[index + 2] = 0;
}