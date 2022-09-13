class AnimatedParticle extends Phaser.GameObjects.Particles.Particle
{
    constructor (emitter)
    {
        super(emitter);

        this.t = 0;
        this.i = 0;
    }

    update (delta, step, processors)
    {
        var result = super.update(delta, step, processors);

        this.t += delta;

        if (this.t >= anim.msPerFrame)
        {
            this.i++;

            if (this.i > 17)
            {
                this.i = 0;
            }

            this.frame = anim.frames[this.i].frame;

            this.t -= anim.msPerFrame;
        }

        return result;
    }
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

let anim;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('mummy', 'assets/animations/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
}

function create ()
{
    let config = {
        key: 'walk',
        frames: this.anims.generateFrameNumbers('mummy'),
        frameRate: 18,
        repeat: -1
    };

    anim = this.anims.create(config);

    let particles = this.add.particles('mummy');

    let emitter = particles.createEmitter({
        x: 100,
        y: 100,
        frame: 0,
        quantity: 1,
        frequency: 200,
        angle: { min: 0, max: 30 },
        speed: 200,
        gravityY: 100,
        lifespan: { min: 1000, max: 2000 },
        particleClass: AnimatedParticle
    });
}
