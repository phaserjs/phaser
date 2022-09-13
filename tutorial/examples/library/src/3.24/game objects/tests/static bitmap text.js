var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var test1;
var test2;
var test3;
var test4;
var test5;
var test6;
var test7;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('grid', 'assets/pics/debug-grid-1920x1920.png');
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create ()
{
    this.add.image(0, 0, 'grid').setOrigin(0);

    //  Test 1
    //  Render object at given coordinates
    test1 = this.add.bitmapText(400, 50, 'desyrel', 'PHASER 3', 32).setOrigin(0.5);

    //  Test 2
    //  Render object at given coordinates factoring in origin 1
    test2 = this.add.bitmapText(400, 150, 'desyrel', 'PHASER 3', 32).setOrigin(1, 0.5);

    //  Test 3
    //  Render object at given coordinates factoring in origin 0
    test3 = this.add.bitmapText(400, 150, 'desyrel', 'PHASER 3', 32).setOrigin(0, 0.5);

    //  Test 4
    //  Render object with scale
    test4 = this.add.bitmapText(400, 250, 'desyrel', 'PHASER 3', 32).setOrigin(0.5).setScale(2);

    //  Test 5
    //  Render object with rotation
    test5 = this.add.bitmapText(400, 350, 'desyrel', 'PHASER 3', 32).setOrigin(0.5);

    //  Test 6
    //  Render object with alpha
    test6 = this.add.bitmapText(400, 450, 'desyrel', 'PHASER 3', 32).setOrigin(0.5).setAlpha(0.5);

    //  Test 7
    //  Render object with blend mode
    test7 = this.add.bitmapText(400, 550, 'desyrel', 'PHASER 3', 32).setOrigin(0.5).setBlendMode(1);
}

function update ()
{
    test5.rotation += 0.01;
}
