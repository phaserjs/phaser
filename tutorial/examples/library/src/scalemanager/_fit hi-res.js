//  To test this on a non-retina display use Chrome Dev Tools,
//  toggle the device bar (ctrl + shift + m), pick the 'Responsive' mode and set DPR to 2.0

var config = {
    type: Phaser.AUTO,
    backgroundColor: '#2dab2d',
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        resolution: 2,
        width: 800,
        height: 600
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/pics/akira.jpg');
}

function create ()
{
    this.add.image(0, 0, 'pic').setOrigin(0).setScale(0.5);
}
