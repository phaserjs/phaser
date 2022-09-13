var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#cdcdcd',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 200 }
        }
    },
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
    this.load.setPath('assets/spine/3.8/coin/');

    this.load.spine('coin', 'coin-pro.json', 'coin-pro.atlas');
}

function create ()
{
    var coin = this.add.spine(400, 200, 'coin', 'animation', true);

    //  Resize the Spine dimensions because the original skeleton includes the shine bone,
    //  rendering a simple bounds check useless. Not all Spine objects will require this, but this one does.
    coin.setSize(280, 280);

    this.physics.add.existing(coin);

    coin.body.setOffset(0, 50);
    coin.body.setVelocity(100, 200);
    coin.body.setBounce(1, 1);
    coin.body.setCollideWorldBounds(true);

    //  Otherwise it's massive :)
    coin.setScale(0.3);
}
