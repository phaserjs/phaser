var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
}

function create ()
{
    this.add.particles('megaset', [
        {
            frame: 'red_ball',
            x: 400,
            y: 590,
            angle: { min: 180, max: 360 },
            speed: 200,
            gravityY: -350,
            lifespan: 3000,
            quantity: 4,
            scale: { min: 0.1, max: 1 }
        },
        {
            frame: 'yellow_ball',
            x: 400,
            y: 590,
            angle: { min: 180, max: 360 },
            speed: 300,
            gravityY: -350,
            lifespan: 3000,
            quantity: 4,
            scale: { min: 0.1, max: 1 }
        },
        {
            frame: 'blue_ball',
            x: 400,
            y: 590,
            angle: { min: 180, max: 360 },
            speed: 400,
            gravityY: -350,
            lifespan: 3000,
            quantity: 4,
            scale: { min: 0.1, max: 1 }
        }
    ]);
}
