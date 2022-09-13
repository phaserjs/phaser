var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    physics: { default: 'arcade' },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

var block;

function preload ()
{
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    var source = {
        contains: function (x, y)
        {
            return block.body.hitTest(x, y);
        }
    };

    var particles = this.add.particles('flares');

    particles.createEmitter({
        frame: [ 'red', 'green', 'blue' ],
        x: 400,
        y: 100,
        speed: 300,
        gravityY: 400,
        lifespan: 4000,
        scale: 0.4,
        blendMode: 'ADD',
        deathZone: { type: 'onEnter', source: source }
    });

    block = this.physics.add.image(400, 100, 'block');

    block.setGravity(0, 200);
    block.setVelocity(100, 200);
    block.setBounce(1, 1);
    block.setCollideWorldBounds(true);

}
