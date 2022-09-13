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
    this.load.spritesheet('veg', 'assets/sprites/fruitnveg64wh37.png', { frameWidth: 64, frameHeight: 64 });
}

function create ()
{
    var particles = this.add.particles('veg');

    //  The emitters created first are placed at the bottom of the display list, just like sprites and other game objects

    var cherries = particles.createEmitter({
        frame: 0,
        x: 400,
        y: 300,
        speed: 100,
        frequency: 150,
        lifespan: 2000
    });

    var orange = particles.createEmitter({
        frame: 1,
        x: 400,
        y: 300,
        speed: 100,
        frequency: 150,
        lifespan: 2000
    });

    var turnip = particles.createEmitter({
        frame: 2,
        x: 400,
        y: 300,
        speed: 100,
        frequency: 150,
        lifespan: 2000
    });

    this.input.once('pointerdown', function (pointer) {

        //  Move the cherries to the top of the display list
        particles.emitters.bringToTop(cherries);

    });
}
