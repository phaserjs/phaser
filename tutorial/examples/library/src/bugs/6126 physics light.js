var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 150 }
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
    this.load.image('brick', ['assets/normal-maps/brick.jpg', 'assets/normal-maps/brick_n.png']);
    this.load.image('phaser', 'assets/sprites/block.png');
}

function create ()
{
    var brick = this.add.sprite(0, 0, 'brick');
    brick.setOrigin(0);
    brick.setPipeline('Light2D');

    var light = this.lights.addLight(400, 200, 100).setIntensity(4);

    // light.angle = 0;
    // light.scaleX = 1;
    // light.scaleY = 1;
    // light.displayOriginX = 0.5;
    // light.displayOriginY = 0.5;

    this.physics.world.enable(light);

    light.body.setVelocity(200, 160);
    light.body.setBounce(1, 1);
    light.body.setCollideWorldBounds(true);

    console.log(light);

    this.lights.enable().setAmbientColor(0x555555);

    var logo = this.physics.add.image(300, 100, 'phaser');
    logo.setVelocity(-100, 160);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);
}
