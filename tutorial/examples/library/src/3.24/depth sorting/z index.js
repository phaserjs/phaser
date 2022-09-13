var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ayu', 'assets/pics/ayu2.png');
}

function create ()
{
    //  When creating images they are added in display order.
    //  The first one created appears at the back of the display list, and so on.
    //  By default that have a depth value of 0 which means "unsorted"
    //  Click to change the depth of image3 to 1, raising it higher than the others.

    var image1 = this.add.image(100, 300, 'ayu');
    var image2 = this.add.image(200, 300, 'ayu');
    var image3 = this.add.image(300, 300, 'ayu');
    var image4 = this.add.image(400, 300, 'ayu');
    var image5 = this.add.image(500, 300, 'ayu');
    var image6 = this.add.image(600, 300, 'ayu');
    var image7 = this.add.image(700, 300, 'ayu');

    this.input.on('pointerdown', function (pointer) {
    
        image3.setDepth(1);
    
    }, this);
}
