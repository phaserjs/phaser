var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var bg;
var rob;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('zombie', 'assets/animations/zombie.png', 'assets/animations/zombie.json');
    this.load.image('bg', 'assets/textures/soil.png');
}

function create ()
{
    bg = this.add.tileSprite(400, 300, 800, 600, 'bg').setAlpha(0.8);

    var text = this.add.text(400, 32, "Click to run playAfterDelay('death', 2000)", { color: '#00ff00' }).setOrigin(0.5, 0);

    //  Our global animations, as defined in the texture atlas
    this.anims.create({ key: 'walk', frames: this.anims.generateFrameNames('zombie', { prefix: 'walk_', end: 8, zeroPad: 3 }), repeat: -1, frameRate: 8 });
    this.anims.create({ key: 'death', frames: this.anims.generateFrameNames('zombie', { prefix: 'Death_', end: 5, zeroPad: 3 }), frameRate: 12 });

    rob = this.add.sprite(400, 560, 'zombie').setOrigin(0.5, 1).play('walk');

    this.input.once('pointerdown', function () {

        text.setText('Playing death animation in 2000 ms');

        rob.anims.playAfterDelay('death', 2000);

    });
}

function update ()
{
    if (rob.anims.getName() === 'walk')
    {
        bg.tilePositionY++;
    }
}
