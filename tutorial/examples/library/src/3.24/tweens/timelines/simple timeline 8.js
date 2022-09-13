var config = {
    type: Phaser.WEBGL,
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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var image1 = this.add.image(100, 100, 'block');
    var image2 = this.add.image(100, 300, 'block');
    var image3 = this.add.image(100, 500, 'block');

    //  Absolute offsets start at Xms into the Timeline

    var timeline = this.tweens.timeline({

        ease: 'Power2',
        duration: 2000,

        tweens: [{
            targets: image1,
            x: 600,
            offset: 3000
        },
        {
            targets: image2,
            x: 600,
            offset: 2000
        },
        {
            targets: image3,
            x: 600,
            offset: 1000
        }]

    });

    console.log(timeline);
}
