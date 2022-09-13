class TestPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager);
    }

    wibble ()
    {
        console.log('hello');
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    plugins: {
        global: [
            { key: 'TestPlugin', plugin: TestPlugin, start: false, mapping: 'test' }
        ]
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('elephant', 'assets/sprites/elephant.png');
}

function create ()
{
    this.test.wibble();
}
