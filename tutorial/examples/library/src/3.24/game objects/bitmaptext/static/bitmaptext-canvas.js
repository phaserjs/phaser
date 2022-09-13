var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var dynamic1 = null;
var dynamic2 = null;
var value = 0;

function preload()
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    this.load.bitmapFont('desyrelPink', 'assets/fonts/bitmap/desyrel-pink.png', 'assets/fonts/bitmap/desyrel-pink.xml');
}

function create()
{
    dynamic1 = this.add.bitmapText(0, 0, 'desyrel', 'hello world', 8);

    this.tweens.add({
        targets: dynamic1,
        duration: 2000,
        fontSize: 128,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });

    dynamic2 = this.add.bitmapText(0, 200, 'desyrelPink', 'hello world', 32);

    this.tweens.add({
        targets: dynamic2,
        duration: 2000,
        scaleX: 6,
        scaleY: 4,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });
}

function update()
{
    dynamic1.text = 'Value: ' + value.toFixed(2);
    dynamic2.text = 'Value: ' + value.toFixed(2);

    value += 0.01;
}
