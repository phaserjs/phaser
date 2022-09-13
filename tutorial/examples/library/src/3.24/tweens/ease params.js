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
    var marker = this.add.image(100, 300, 'block').setAlpha(0.3);
    var image = this.add.image(100, 300, 'block');

    //  The 'Back' ease takes one argument: overshoot.
    //  The default value is 1.70158
    //  But you can set whatever you like in the easeParams array

    this.tweens.add({
        targets: image,
        x: 600,
        duration: 3000,
        ease: 'Back',
        easeParams: [ 3.5 ],
        delay: 1000
    });
}
