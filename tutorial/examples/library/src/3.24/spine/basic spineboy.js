var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: {
        preload: preload,
        create: create,
        pack: {
            files: [
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/SpinePlugin.js', sceneKey: 'spine' }
            ]
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');

    this.load.setPath('assets/spine/demos/');

    this.load.spine('set1', 'demos.json', [ 'atlas1.atlas' ], true);
}

function create ()
{
    this.add.image(0, 0, 'logo').setOrigin(0);

    this.add.spine(400, 600, 'set1.spineboy', 'idle', true);
}
