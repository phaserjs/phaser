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
    var marker = this.add.image(100, 100, 'block').setAlpha(0.3);
    var image = this.add.image(100, 100, 'block');

    //  Relative offsets start Xms +- the end of the previous Tween in the Timeline

    var timeline = this.tweens.timeline({

        targets: image,
        ease: 'Linear',
        duration: 2000,

        tweens: [{
            x: 600,
        },
        {
            y: 500,
            offset: '+=1000'
        },
        {
            x: 100,
            offset: '-=1000'
        },
        {
            y: 100,
            offset: '+=1000'
        }]

    });

    console.log(timeline);
}
