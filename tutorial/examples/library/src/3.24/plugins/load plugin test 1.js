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
    this.load.plugin('RandomNamePlugin', 'assets/loader-tests/RandomNamePlugin.js', true);
}

function create ()
{
    let plugin = this.plugins.get('RandomNamePlugin');

    let names = plugin.getNames(10);

    this.add.text(10, 10, names, { font: '16px Courier', fill: '#00ff00' });
}
