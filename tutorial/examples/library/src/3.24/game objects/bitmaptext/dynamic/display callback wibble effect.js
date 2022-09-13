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
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create()
{
    var text = this.add.dynamicBitmapText(60, 200, 'desyrel', 'HELLO WORLD!', 64);

    text.setDisplayCallback(textCallback);

    this.tweens.add({
        targets: text,
        duration: 2000,
        delay: 2000,
        scaleX: 2,
        scaleY: 2,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });
}

//  data = { index: index, charCode: charCode, x: x, y: y, scaleX: scaleX, scaleY: scaleY }
function textCallback (data)
{
    data.x = Phaser.Math.Between(data.x - 2, data.x + 2);
    data.y = Phaser.Math.Between(data.y - 4, data.y + 4);

    return data;
}