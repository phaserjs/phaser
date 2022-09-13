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
                { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8/SpinePlugin.js', sceneKey: 'spine' }
            ]
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');

    this.load.setPath('assets/spine/3.8/owl/');

    this.load.spine('owl', 'owl-pro.json', 'owl-pro.atlas', true);
}

function create ()
{
    this.add.image(0, 0, 'logo').setOrigin(0);

    this.add.spine(400, 500, 'owl', 'idle', true).setScale(0.8);
}
