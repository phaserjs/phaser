var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#fbf0e4',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.path = 'assets/animations/';

    this.load.image('cat1', 'cat1.png');
    this.load.image('cat2', 'cat2.png');
    this.load.image('cat3', 'cat3.png');
    this.load.image('cat4', 'cat4.png');
}

function create ()
{
    this.anims.create({
        key: 'snooze',
        frames: [
            { key: 'cat1' },
            { key: 'cat2' },
            { key: 'cat3' },
            { key: 'cat4', duration: 50 }
        ],
        frameRate: 8,
        repeat: -1
    });

    this.add.sprite(400, 300, 'cat1').play('snooze');
}
