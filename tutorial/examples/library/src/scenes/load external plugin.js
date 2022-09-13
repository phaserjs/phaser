var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.plugin('BasePlugin', '../../phaser3-plugin-template/dist/BasePlugin.js');
}

function create ()
{
    this.sys.install('BasePlugin');

    this.sys.base.test('Rich');

    // console.log(this.sys);

    // this.add.image(400, 300, 'face');
}
