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

var k = 3;

var rose = {
    getPoints: function (quantity, stepRate)
    {
        if (!stepRate)
        {
            stepRate = Phaser.Math.PI2 / quantity;
        }

        var input = Phaser.Utils.Array.NumberArrayStep(0, Phaser.Math.PI2, stepRate);
        var output = new Array(input.length);

        for (var i = 0; i < input.length; i++)
        {
            var angle = input[i];
            output[i] = new Phaser.Math.Vector2().setToPolar(angle, 200 * Math.cos(k * angle));
        }

        return output;
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    var particles = this.add.particles('flares');

    var emitter = particles.createEmitter({
        frame: { frames: [ 'green', 'blue' ], cycle: true },
        x: 400,
        y: 300,
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        emitZone: { type: 'edge', source: rose, quantity: 360 }
    });

    this.input.on('pointerup', function ()
    {
        k++;
        emitter.emitZone.updateSource();
    });
}
