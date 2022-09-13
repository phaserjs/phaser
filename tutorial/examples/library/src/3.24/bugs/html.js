var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.CENTER_HORIZONTALLY,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 1280,
        height: 800,
        parent: 'phaser-example'
    },
    dom: {
        createContainer: true
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.html('loginForm', 'assets/text/test.html');
}

function create ()
{
    var element = this.add.dom(640, 400).createFromCache('loginForm');
}
