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
    //  The text in the banner will be in white on a neon pink background.
    //  The colors at the start of the background array define the blocks
    //  at the beginning of the banner
    title: 'Shock and Awesome',
    banner: {
        text: '#ffffff',
        background: [
            '#fff200',
            '#38f0e8',
            '#00bff3',
            '#ec008c'
        ],
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
        'Game Title: ' + game.config.gameTitle
    ]);
}
