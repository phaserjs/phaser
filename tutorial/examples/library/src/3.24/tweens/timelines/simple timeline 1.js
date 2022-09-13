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

    var timeline = this.tweens.timeline({

        tweens: [{
            targets: image,
            x: 600,
            ease: 'Power1',
            duration: 1000
        },
        {
            targets: image,
            y: 500,
            ease: 'Power1',
            duration: 1000
        },
        {
            targets: image,
            x: 100,
            ease: 'Power1',
            duration: 1000
        },
        {
            targets: image,
            y: 100,
            ease: 'Power1',
            duration: 1000
        }]

    });
}
