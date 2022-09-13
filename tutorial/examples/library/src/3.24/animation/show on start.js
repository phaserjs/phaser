var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('bird', 'assets/animations/bird.png', 'assets/animations/bird.json');
}

function create ()
{
    this.add.text(400, 32, 'Click to get the next sprite', { color: '#00ff00' }).setOrigin(0.5, 0);

    var animConfig = {
        key: 'walk',
        frames: this.anims.generateFrameNames('bird', { prefix: 'frame', end: 9 }),
        repeat: -1,
        showOnStart: true
    };

    this.anims.create(animConfig);

    //  Create a bunch of random sprites

    var rect = new Phaser.Geom.Rectangle(64, 64, 672, 472);

    var group = this.add.group();

    group.createMultiple({ key: 'bird', frame: 0, quantity: 64, visible: false, active: false });

    //  Randomly position the sprites within the rectangle
    Phaser.Actions.RandomRectangle(group.getChildren(), rect);

    this.input.on('pointerdown', function () {

        var bird = group.getFirstDead();

        if (bird)
        {
            bird.active = true;

            bird.setDepth(bird.y);

            //  As soon as we play the animation, the Sprite will be made visible
            bird.play('walk');
        }

    });
}
