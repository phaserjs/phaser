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
    //  The title of your game will appear in the banner text
    title: 'Shock and Awesome'
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/baal-loader.png');
}

function create ()
{
    this.add.image(400, 300, 'pic');

    this.add.text(80, 560, 'Game Title: ' + game.config.gameTitle, { font: '16px Courier', fill: '#ffffff' });
}
