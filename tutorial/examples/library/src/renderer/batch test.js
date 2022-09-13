var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('brain', 'assets/sprites/brain.png');
    this.load.image('apple', 'assets/sprites/apple.png');
    this.load.image('ball', 'assets/sprites/aqua_ball.png');
}

function create ()
{
    this.add.sprite(200, 300, 'bunny').setName('bunny1');
    this.add.sprite(400, 300, 'bunny').setName('bunny2');
    this.add.sprite(600, 300, 'bunny').setName('bunny3');

    this.add.rectangle(400, 100, 500, 16, 0x6666ff);

    this.add.sprite(200, 300, 'brain').setName('brain1');
    this.add.sprite(400, 300, 'brain').setName('brain2');
    this.add.sprite(600, 300, 'brain').setName('brain3');

    this.add.circle(400, 100, 64, 0x9966ff);

    this.add.sprite(200, 300, 'block').setName('block1');
    this.add.sprite(400, 300, 'block').setName('block2');
    this.add.sprite(600, 300, 'block').setName('block3');

    this.add.text(400, 100, 'Multi Texturing').setOrigin(0.5);

    this.add.sprite(200, 300, 'apple').setName('apple1');
    this.add.sprite(400, 300, 'apple').setName('apple2');
    this.add.sprite(600, 300, 'apple').setName('apple3');

    this.add.sprite(200, 300, 'ball').setName('ball1');
    this.add.sprite(400, 300, 'ball').setName('ball2');
    this.add.sprite(600, 300, 'ball').setName('ball3');
}
