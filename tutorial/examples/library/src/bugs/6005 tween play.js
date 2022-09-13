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
    this.load.spritesheet('fish', 'assets/sprites/fish-136x80.png', { frameWidth: 136, frameHeight: 80 });
}

function create ()
{
    var image1 = this.add.image(0, 80, 'fish', 0);

    var tween = this.tweens.add({
        targets: image1,
        props: {
            x: { value: 700, duration: 4000, flipX: true },
            y: { value: 500, duration: 8000,  },
        },
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        paused: true
    });

    tween.play();
}
