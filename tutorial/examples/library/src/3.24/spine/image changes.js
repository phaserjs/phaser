var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#cdcdcd',
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
    this.load.setPath('assets/spine/demos/');

    this.load.spine('set1', 'demos.json', 'atlas1.atlas');
}

function create ()
{
    var b = this.add.spine(400, 500, 'set1.alien', 'death', false).setScale(0.4);
    var c = this.add.spine(400, 200, 'set1.dragon', 'flying', true).setScale(0.4);


}
