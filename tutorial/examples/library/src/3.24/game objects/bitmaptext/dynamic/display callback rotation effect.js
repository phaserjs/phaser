var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var scale = { r: -Math.PI };

function preload()
{
    this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
    this.load.bitmapFont('atari', 'assets/fonts/bitmap/atari-smooth.png', 'assets/fonts/bitmap/atari-smooth.xml');
    this.load.bitmapFont('gothic', 'assets/fonts/bitmap/gothic.png', 'assets/fonts/bitmap/gothic.xml');
    this.load.bitmapFont('hyper', 'assets/fonts/bitmap/hyperdrive.png', 'assets/fonts/bitmap/hyperdrive.xml');
}

function create()
{
    // var text = this.add.bitmapText(60, 200, 'hyper', 'Hello World!', 128);
    // var text = this.add.bitmapText(60, 200, 'atari', 'Hello\nWorld!', 128);
    var text = this.add.dynamicBitmapText(60, 60, 'gothic', 'Hello\nWorld!', 128);
    text.setDisplayCallback(textCallback);

    var text2 = this.add.dynamicBitmapText(560, 60, 'ice', 'Hello\nWorld!', 128);
    text2.setDisplayCallback(textCallback);

    var text3 = this.add.dynamicBitmapText(100, 460, 'hyper', 'Terminator', 200);
    text3.setDisplayCallback(textCallback);

    this.tweens.add({
        targets: scale,
        duration: 2000,
        r: Math.PI,
        ease: 'Linear',
        repeat: -1
    });
}

//  data = { index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY }
function textCallback (data)
{
    data.rotation = scale.r;
    // data.rotation = Phaser.Math.Between(-0.02, 0.02);
    // data.rotation = 1.570;

    return data;
}