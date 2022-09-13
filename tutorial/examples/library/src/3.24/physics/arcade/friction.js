var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {default: 'arcade'},
    scene: {
        preload: preload,
        create: create
    }
};

var platforms;
var lemmings;

new Phaser.Game(config);

function preload ()
{
    this.load.image('platform', 'assets/sprites/platform.png');
    this.load.image('lemming', 'assets/sprites/lemming.png');
    this.load.image('spikedball', 'assets/sprites/spikedball.png');
}

function create ()
{
    platforms = this.physics.add.group({
        key: 'platform',
        frameQuantity: 3,
        setXY: { x: 400, y: 150, stepY: 150 },
        velocityX: 60,
        immovable: true
    });

    platforms.getChildren()[0].setFrictionX(1);
    platforms.getChildren()[1].setFrictionX(0.5);
    platforms.getChildren()[2].setFrictionX(0);

    lemmings = this.physics.add.group({ gravityY: 600 });

    lemmings.createMultiple({ key: 'lemming', repeat: 3, setXY: { x: 250, y: 0, stepX: 100 } });
    lemmings.createMultiple({ key: 'lemming', repeat: 3, setXY: { x: 250, y: 200, stepX: 100 } });
    lemmings.createMultiple({ key: 'lemming', repeat: 3, setXY: { x: 250, y: 350, stepX: 100 } });

    this.physics.add.group({
        key: 'spikedball',
        frameQuantity: 6,
        setXY: { x: 0, y: 625, stepX: 150 },
        angularVelocity: 60
    });

    this.physics.add.collider(lemmings, platforms);
}
