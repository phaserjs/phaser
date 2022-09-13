class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('gems', 'assets/animations/diamond.png', 'assets/animations/diamond.json');
    }

    create ()
    {
        this.anims.create({
            key: 'diamond',
            frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }),
            frameRate: 16,
            yoyo: true,
            repeat: -1,
            repeatDelay: 300
        });

        // this.gem is a local variable.
        this.gem = this.add.sprite(400, 480, 'gems')
            .play('diamond').setScale(4);

        this.debug = this.add.graphics();
    }

    update ()
    {
        this.debug.clear();

        const size = 672;

        this.debug.fillStyle(0x2d2d2d);
        this.debug.fillRect(64, 64, size, 48);

        this.debug.fillStyle(0x2dff2d);
        this.debug.fillRect(64, 64, size * this.gem.anims.getProgress(), 48);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    pixelArt: true,
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
