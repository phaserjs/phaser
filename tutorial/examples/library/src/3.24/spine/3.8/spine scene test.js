class Example extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'Example1',
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload ()
    {
        this.load.image('logo', 'assets/sprites/phaser.png');

        this.load.setPath('assets/spine/3.8/demos/');

        this.load.spine('set1', 'demos.json', [ 'atlas1.atlas' ], true);
    }

    create ()
    {
        this.add.image(0, 0, 'logo').setOrigin(0);

        this.add.spine(400, 600, 'set1.alien', 'death', true);

        this.add.text(300, 10, 'Scene 1 - Click to change', { font: '16px Courier', fill: '#00ff00' });

        this.input.once('pointerdown', () => {

            this.scene.start('Example2');

        });
    }
}

class Example2 extends Phaser.Scene
{
    constructor ()
    {
        super('Example2');
    }

    create ()
    {
        this.add.image(0, 0, 'logo').setOrigin(0);

        this.add.spine(400, 600, 'set1.spineboy', 'run', true);

        this.add.text(300, 10, 'Scene 2 - Click to change', { font: '16px Courier', fill: '#00ff00' });

        this.input.once('pointerdown', () => {

            this.scene.start('Example1');

        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Example, Example2 ]
};

let game = new Phaser.Game(config);
