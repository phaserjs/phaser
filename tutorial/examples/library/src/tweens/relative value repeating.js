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
    var image = this.add.image(400, 500, 'block');

    var tween = this.tweens.add({
        targets: image,
        y: '-=64',
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: 6
    });

    console.log(tween);

}
