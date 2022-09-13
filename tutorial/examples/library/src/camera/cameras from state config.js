// Scene configuration
const sceneConfig = {
    key: 'Example',
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

// Scene
class Example extends Phaser.Scene
{
    constructor ()
    {
        super(sceneConfig);
    }

    preload ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
    }

    create ()
    {
        this.image = this.add.image(200, 150, 'mech');
    }

    update ()
    {
        this.image.rotation += 0.01;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
