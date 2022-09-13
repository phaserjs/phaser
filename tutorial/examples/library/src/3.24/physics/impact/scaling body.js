var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#124184',
    pixelArt: true,
    physics: {
        default: 'impact',
        impact: {
            maxVelocity: 300,
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var movingBody;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', { frameWidth: 40, frameHeight: 60 });
}

function create ()
{
    this.impact.world.setBounds();

    var scalingBody = this.impact.add.image(200, 140, 'gameboy', 2).setFixedCollision().setBodyScale(3);

    movingBody = this.impact.add.image(600, 200, 'gameboy', 3).setActiveCollision();

    var scale = { x: 3, y: 3 };

    this.tweens.add({

        targets: scale,

        x: 6,
        y: 6,
        duration: 2000,
        ease: 'Linear.easeNone',
        yoyo: true,
        repeat: -1,
        paused: false,

        onUpdate: function ()
        {
            scalingBody.setBodyScale(scale.x, scale.y);
            scalingBody.syncGameObject()
        }

    });
}

function update ()
{
    movingBody.vel.x = -100;
}
