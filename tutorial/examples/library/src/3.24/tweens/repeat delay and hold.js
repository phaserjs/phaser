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

    var tween = this.tweens.add({
        targets: image,
        x: 700,
        duration: 2000,
        ease: 'Power4',
        repeat: 2,
        repeatDelay: 1000,
        hold: 2000
    });

    console.log(tween);
}
