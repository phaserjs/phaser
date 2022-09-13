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
    this.load.image('arrow', 'assets/sprites/arrow.png');
}

function create ()
{
    var marker = this.add.image(100, 100, 'arrow').setAlpha(0.3);
    var image = this.add.image(100, 100, 'arrow');

    //  flipX will call toggleFlipX on the image whenever it yoyos or repeats

    var tween = this.tweens.add({
        targets: image,
        x: 600,
        ease: 'Power1',
        duration: 3000,
        flipX: true,
        yoyo: true,
        repeat: -1
    });

    //  If you are tweening MULTIPLE properties then be careful because it will call flipX for _each property_
}
