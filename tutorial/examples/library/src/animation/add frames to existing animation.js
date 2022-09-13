class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
    }

    create ()
    {
        const text = this.add.text(400, 32, 'Click to add frames to current Animation', { color: '#00ff00' })
            .setOrigin(0.5, 0);

        //  Create an animation with 5 frames
        this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });

        const group = this.add.group({
            key: 'gems',
            frame: 'diamond_0000',
            frameQuantity: 6 * 6
        });

        group.playAnimation('diamond');

        Phaser.Actions.GridAlign(group.getChildren(), {
            width: 6,
            height: 6,
            cellWidth: 64,
            cellHeight: 64,
            x: 240,
            y: 160
        });

        this.input.once('pointerup', function () {

            const diamond = this.anims.get('diamond');

            //  Add in the new frames to the current animation
            const newFrames = this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 });

            diamond.addFrame(newFrames);

        }, this);
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
