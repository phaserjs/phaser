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
var value = 0;

function preload() 
{
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create() 
{
    dynamic1 = this.add.bitmapText(0, 0, 'desyrel', 'welcome to the jungle\nwe got fun and games');

    // TweenMax.to(dynamic1, 2, {
    //     scaleX: 4,
    //     scaleY: 4,
    //     ease: Sine.easeInOut,
    //     repeat: -1,
    //     yoyo: true
    // });

}

function update()
{
    // dynamic1.text = 'Value: ' + value.toFixed(2);
    // value += 0.01;
}
