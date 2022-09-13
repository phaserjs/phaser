class RandomNamePlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super('RandomNamePlugin', pluginManager);

        this.syllables = [ 'fro', 'tir', 'nag', 'bli', 'mon', 'fay', 'shi', 'zag', 'blarg', 'rash', 'izen' ];
    }

    init ()
    {
        console.log('Plugin is alive');
    }

    getName ()
    {
        let name = '';

        for (let i = 0; i < Phaser.Math.Between(2, 4); i++)
        {
            name = name.concat(Phaser.Utils.Array.GetRandom(this.syllables));
        }

        return Phaser.Utils.String.UppercaseFirst(name);
    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    plugins: {
        global: [
            { key: 'RandomNamePlugin', plugin: RandomNamePlugin, start: true }
        ]
    },
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);

function preload ()
{
    this.load.image('elephant', 'assets/sprites/elephant.png');
}

function create ()
{
    let image = this.add.image(400, 300, 'elephant');

    let plugin = this.plugins.get('RandomNamePlugin');

    let name = plugin.getName();

    this.add.text(10, 10, 'The elephants name is: ' + name, { font: '16px Courier', fill: '#00ff00' });
}
