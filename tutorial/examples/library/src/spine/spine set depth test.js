class Example extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'Example1',
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePluginDebug.js', sceneKey: 'spine' }
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
        this.add.image(400, 350, 'logo').setName('logo1').setDepth(2);

        this.add.spine(200, 600, 'set1.alien', 'death', true).setName('alien').setScale(0.5).setDepth(1);

        // this.add.image(400, 380, 'logo').setName('logo2');

        // this.add.text(300, 10, 'Set Depth Test', { font: '16px Courier', fill: '#00ff00' }).setName('text');

        // this.add.spine(200, 600, 'set1.alien', 'death', true).setName('alien').setScale(0.5);

        // this.add.image(400, 380, 'logo').setName('logo2');

        this.add.text(400, 300, 'Set Depth Test', { font: '16px Courier', fill: '#00ff00' }).setName('text').setOrigin(0.5);

        // this.add.spine(500, 600, 'set1.spineboy', 'run', true).setScale(0.5).setName('boy');
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Example ]
};

let game = new Phaser.Game(config);
