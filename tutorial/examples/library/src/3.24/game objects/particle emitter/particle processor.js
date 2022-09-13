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

var SECOND = 1000;

new Phaser.Game(config);

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
}

function create ()
{
    var lowWind = {
        tween: this.tweens.addCounter({
            from: -5,
            to: 5,
            duration: 11 * SECOND,
            loop: Phaser.FOREVER,
            ease: 'Sine.easeInOut'
        }),
        processor: {
            active: true,
            update: function (particle)
            {
                particle.velocityX += lowWind.tween.getValue();
            }
        }
    };

    var highWind = {
        tween: this.tweens.addCounter({
            from: -10,
            to: 10,
            duration: 4 * SECOND,
            loop: Phaser.FOREVER,
            ease: 'Sine.easeInOut'
        }),
        processor: {
            active: true,
            update: function (particle)
            {
                particle.velocityX += highWind.tween.getValue();
            }
        }
    };

    var particles = this.add.particles('flares');

    particles.addGravityWell(lowWind.processor);
    particles.addGravityWell(highWind.processor);

    particles.createEmitter({
        frame: [ 'red', 'yellow' ],
        x: 600,
        y: 400,
        lifespan: 4000,
        speed: 200,
        scale: { start: 0.7, end: 0 },
        blendMode: 'ADD'
    });
}
