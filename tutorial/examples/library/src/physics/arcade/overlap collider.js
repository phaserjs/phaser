var config = {
    type: Phaser.AUTO,
    antialias: false,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {debug: true}
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;
var group;

new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    sprite = this.physics.add.image(400, 300, 'mushroom')
        .setVelocity(100, 200)
        .setBounce(1, 1)
        .setCollideWorldBounds(true)
        .setGravityY(200);

    group = this.physics.add.staticGroup({
        key: 'ball',
        frameQuantity: 30
    });

    Phaser.Actions.PlaceOnRectangle(group.getChildren(), new Phaser.Geom.Rectangle(84, 84, 616, 416));

    group.refresh();

    this.physics.add.overlap(sprite, group);
}

function update ()
{
    sprite.body.debugBodyColor = sprite.body.touching.none ? 0x0099ff : 0xff9900;
}
