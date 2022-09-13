class Preloader extends Phaser.Scene
{
    constructor ()
    {
        super({
            key: 'Preloader',
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8.95/SpinePluginDebug.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload ()
    {
        this.load.setPath('assets/spine/3.8/demos/');

        this.load.spine('set1', 'demos.json', [ 'atlas1.atlas', 'atlas2.atlas' ], true);
    }

    create ()
    {
        this.scene.start('Example');
    }
}

class Example extends Phaser.Scene
{
    constructor ()
    {
        super('Example');
    }

    create ()
    {
        //  From atlas1
        this.add.spine(200, 600, 'set1.spineboy', 'run', true).setScale(0.5);

        //  From atlas2
        this.add.spine(600, 600, 'set1.armorgirl', 'animation', true).setScale(0.25);

        this.add.text(10, 10, 'Scene 2', { font: '16px Courier', fill: '#00ff00' });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ Preloader, Example ]
};

let game = new Phaser.Game(config);
