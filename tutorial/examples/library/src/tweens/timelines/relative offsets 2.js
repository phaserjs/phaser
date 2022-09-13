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

        targets: image,

        tweens: [{
            x: 600,
            ease: 'Linear',
            duration: 3000
        },
        {
            y: 500,
            ease: 'Linear',
            duration: 1000,
            offset: '-=500' // starts 500ms before previous tween ends
        },
        {
            x: 100,
            ease: 'Linear',
            duration: 3000,
            offset: '-=500' // starts 500ms before previous tween ends
        },
        {
            y: 100,
            ease: 'Linear',
            duration: 1000,
            offset: '-=500' // starts 500ms before previous tween ends
        }]

    });

    console.log(timeline);
}
