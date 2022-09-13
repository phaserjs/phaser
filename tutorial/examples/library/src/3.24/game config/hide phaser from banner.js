var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    },
    //  Open the Dev Tools
    //  Notice that it no longer says Phaser, or the Phaser version, in the banner
    banner: {
        hidePhaser: true
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/baal-loader.png');
}

function create ()
{
    this.add.image(400, 300, 'pic');

    var text = this.add.text(80, 550, '', { font: '16px Courier', fill: '#ffffff' });

    text.setText([
        'Game Title: ' + game.config.gameTitle,
        'Version: ' + game.config.gameVersion
    ]);
}
