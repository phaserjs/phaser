var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 400,
    parent: 'phaser-example',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200
            }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/skies/space2.png');
    this.load.image('cockpit', 'assets/pics/cockpit.png');
    this.load.spritesheet('ball', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    this.add.image(320, 200, 'bg');
    this.add.image(320, 200, 'cockpit').setScale(2);

    var customBounds = new Phaser.Geom.Rectangle(32, 20, 576, 240);

    var group = this.physics.add.group({
        key: 'ball',
        frameQuantity: 48,
        bounceX: 1,
        bounceY: 1,
        customBoundsRectangle: customBounds,
        collideWorldBounds: true,
        velocityX: 180,
        velocityY: 120,
    });

    Phaser.Actions.RandomRectangle(group.getChildren(), customBounds);
}
