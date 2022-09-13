var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('spark0', 'assets/particles/blue.png');
    this.load.image('spark1', 'assets/particles/red.png');
}

function create ()
{
    var emitter0 = this.add.particles('spark0').createEmitter({
        x: 400,
        y: 300,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 600,
        gravityY: 800
    });

    var emitter1 = this.add.particles('spark1').createEmitter({
        x: 400,
        y: 300,
        speed: { min: -800, max: 800 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.3, end: 0 },
        blendMode: 'SCREEN',
        //active: false,
        lifespan: 300,
        gravityY: 800
    });

    this.input.on('pointerdown', function (pointer) {
        emitter0.setPosition(pointer.x, pointer.y);
        emitter1.setPosition(pointer.x, pointer.y);
        emitter0.explode();
        emitter1.explode();
    });

}

function update ()
{
}

