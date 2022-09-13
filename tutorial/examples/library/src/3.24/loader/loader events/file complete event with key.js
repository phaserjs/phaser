var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    pixelArt: true,
    scene: {
        preload: preload
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('taikodrummaster', 'assets/pics/taikodrummaster.jpg');

    this.load.image('sukasuka-chtholly', 'assets/pics/sukasuka-chtholly.png');

    this.load.on('filecomplete_image_taikodrummaster', addImage, this);
}

function addImage (key, file)
{
    this.add.image(400, 300, key);
}
