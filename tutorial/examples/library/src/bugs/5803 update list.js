var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('walker', 'assets/animations/walker.png', 'assets/animations/walker.json');
}

function create ()
{
    const animConfig = {
        key: 'walk',
        frames: 'walker',
        frameRate: 60,
        repeat: -1
    };

    this.anims.create(animConfig);

    const sprite = this.add.sprite(0, 0, 'walker', 'frame_0000');

    // const sprite = new Phaser.GameObjects.Sprite(this, 0, 0, 'walker', 'frame_0000');

    sprite.play('walk');

    sprite.destroy();

    // var container = this.add.container(400, 300);

    // container.add(sprite);

    console.log(this);
}
