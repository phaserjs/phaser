var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload()
{
    this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
}

function create() 
{
    var noTintText = this.add.bitmapText(64, 64, 'ice', 'Phaser III\nTinted Text', 128);

    var tintedText = this.add.bitmapText(64, 400, 'ice', 'Phaser III\nTinted Text', 128);

    tintedText.setTint(0xff00ff, 0xffff00, 0x00ff00, 0xff0000);
}
