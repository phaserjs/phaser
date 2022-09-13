var sceneConfig = {
    preload: preload,
    create: create,
    update: update,
    cameras: [
        {
            width: 400,
            height: 300,
            backgroundColor: '#ff0000'
        },
        {
            x: 400,
            y: 0,
            width: 400,
            height: 300,
            backgroundColor: '#ff00ff'
        },
        {
            x: 0,
            y: 300,
            width: 400,
            height: 300,
            backgroundColor: '#ffff00'
        },
        {
            x: 400,
            y: 300,
            width: 400,
            height: 300,
            backgroundColor: '#00ff00'
        }
    ]
};

var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: sceneConfig
};

var image;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('mech', 'assets/pics/titan-mech.png');
}

function create ()
{
    image = this.add.image(200, 150, 'mech');
}

function update ()
{
    image.rotation += 0.01;
}
