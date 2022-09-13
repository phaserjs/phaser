var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#304858',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bg;
var trees;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('walker', 'assets/animations/walker.png', 'assets/animations/walker.json');
    this.load.image('sky', 'assets/skies/ms3-sky.png');
    this.load.image('trees', 'assets/skies/ms3-trees.png');
}

function create ()
{
    bg = this.add.tileSprite(0, 38, 800, 296, 'sky').setOrigin(0, 0);
    trees = this.add.tileSprite(0, 280, 800, 320, 'trees').setOrigin(0, 0);

    var animConfig = {
        key: 'walk',
        frames: 'walker',
        frameRate: 60,
        repeat: -1
    };

    this.anims.create(animConfig);

    var sprite = this.add.sprite(400, 484, 'walker', 'frame_0000');

    sprite.play('walk');
}

function update ()
{
    bg.tilePositionX -= 2;
    trees.tilePositionX -= 6;
}
