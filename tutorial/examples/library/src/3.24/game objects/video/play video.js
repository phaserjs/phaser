var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.video('wormhole', 'assets/video/wormhole.mp4', 'loadeddata', false, true);
}

function create ()
{
    var vid = this.add.video(400, 300, 'wormhole');

    vid.play(true);
}
