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
    var image = this.add.image(0, 400, 'block');

    var tween = this.tweens.add({
        targets: image,
        props: {
            x: { value: 800, duration: 5000, ease: 'Linear' },
            y: { value: 100, duration: 1000, ease: 'Bounce.easeInOut', yoyo: true, delay: 1000 }
        }
    });

    console.log(tween);

}
