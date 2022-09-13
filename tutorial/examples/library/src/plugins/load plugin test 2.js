class RandomNamePlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager);

        this.syllables1 = [ 'fro', 'tir', 'nag', 'bli', 'mon', 'zip' ];
        this.syllables2 = [ 'fay', 'shi', 'zag', 'blarg', 'rash', 'izen' ];

        this.current = this.syllables1;
    }

    changeSet ()
    {
        this.current = this.syllables2;
    }

    getNames (qty = 10)
    {
        let names = [];

        for (let i = 0; i < qty; i++)
        {
            let name = '';

            for (let i = 0; i < Phaser.Math.Between(2, 4); i++)
            {
                name = name.concat(Phaser.Utils.Array.GetRandom(this.current));
            }

            names.push(Phaser.Utils.String.UppercaseFirst(name));
        }

        return names;
    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);

function preload ()
{
    this.load.plugin('RandomNamePlugin', RandomNamePlugin, true);
}

function create ()
{
    let plugin = this.plugins.get('RandomNamePlugin');

    let names = plugin.getNames(10);

    this.add.text(10, 10, names, { font: '16px Courier', fill: '#00ff00' });
}
