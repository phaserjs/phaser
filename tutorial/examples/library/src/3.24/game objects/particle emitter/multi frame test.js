var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var emitter;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('veg', 'assets/sprites/fruitnveg64wh37.png', { frameWidth: 64, frameHeight: 64 });
}

function create ()
{
    emitter = this.add.emitter(400, 32, 'veg');

    //  Pros:
    //  Easy
    //  
    //  Cons:
    //  Have to change all settings if you want to emit a different type of pattern
    //  Can't easily change settings, need to manage own states

    emitter.enabled = false;
    emitter.setScale(1, 0);
    emitter.setEmitAngle(180, 180);
    emitter.setAngle(0, 360);
    emitter.setSpeed(-400, 400);
    emitter.life = 4;
    emitter.gravityY = 400;

    //  Create an Emitter Manager instance. All emitters have to use the same texture bound here.

    particles = this.add.particles('veg');

    //  Works in the same way as 'this.add.emitter' did before now.
    //  Could not set a key at all, then you _have_ to handle everything via the Emitter API.
    //  Yes, much better. Then can register new Emitters with the same Manager.

    var demoFx = particles.createEmitter('demo');

    // var demoFx = emitter.create('demo');

    demoFx.setScale(1, 0.5);
    demoFx.setSpeed(100, 200);



    emitter.createSet('vegFlow', {
        flow: true,
        frame: { min: 0, max: 37 },
        scale: { min: 0, max: 1 },
        particleAngle: { min: 0, max: 360 },
        emitAngle: 180,
        speed: { min: -400, max: 400 },
        lifespan: 4000,
        gravity: { x: 0, y: 400 }
    });

    //  Can also set from JSON cache
    emitter.createSet('cherryBurst', {
        explode: true,
        frame: 2,
        speed: { min: -400, max: 400 },
    });

    //  Start a flow emitter running constantly (can still modify x/y and params on the fly)
    emitter.start('vegFlow');

    //  onclick explde
    emitter.start('cherryBurst', x, y);
}

function update ()
{
    emitter.emitParticle(4, Phaser.Math.Between(0, 36));
}
