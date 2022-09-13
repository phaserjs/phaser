class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('zombie', 'assets/animations/zombie.png', 'assets/animations/zombie.json');
        this.load.image('bg', 'assets/textures/soil.png');
    }

    create ()
    {
        this.bg = this.add.tileSprite(400, 300, 800, 600, 'bg').setAlpha(0.8);
        const text = this.add.text(400, 32, "Click to run playAfterDelay('death', 2000)", { color: '#00ff00' }).setOrigin(0.5, 0);

        //  Our global animations, as defined in the texture atlas
        this.anims.create({ key: 'walk', frames: this.anims.generateFrameNames('zombie', { prefix: 'walk_', end: 8, zeroPad: 3 }), repeat: -1, frameRate: 8 });
        this.anims.create({ key: 'death', frames: this.anims.generateFrameNames('zombie', { prefix: 'Death_', end: 5, zeroPad: 3 }), frameRate: 12 });

        this.rob = this.add.sprite(400, 560, 'zombie').setOrigin(0.5, 1).play('walk');

        this.input.once('pointerdown', function () {
            text.setText('Playing death animation in 2000 ms');

            this.rob.anims.playAfterDelay('death', 2000);

        }, this);
    }

    update ()
    {
        if (this.rob.anims.getName() === 'walk')
        {
            this.bg.tilePositionY++;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
