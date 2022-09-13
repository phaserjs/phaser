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

var timeline;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var image = this.add.image(100, 300, 'block');

    timeline = this.tweens.timeline({

        targets: image,
        loop: 4,

        tweens: [
        {
            x: 700,
            ease: 'Sine.easeInOut',
            duration: 2000,
            yoyo: true
        },
        {
            y: 100,
            ease: 'Sine.easeOut',
            duration: 1000,
            offset: 0
        },
        {
            y: 300,
            ease: 'Sine.easeIn',
            duration: 1000
        },
        {
            y: 500,
            ease: 'Sine.easeOut',
            duration: 1000
        },
        {
            y: 300,
            ease: 'Sine.easeIn',
            duration: 1000
        }
        ]

    });

    console.log(timeline);
}
