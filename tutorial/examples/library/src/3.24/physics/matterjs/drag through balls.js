var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter'
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('blue', 'assets/particles/blue.png');
}

function create ()
{
    this.matter.world.setBounds(0, 0, 800, 550);

    for (var i = 0; i < 256; i++)
    {
        var particle = this.matter.add.image(
            Phaser.Math.Between(0, 800),
            Phaser.Math.Between(0, 400),
            'blue', null,
            { shape: { type: 'polygon', radius: 18 }, ignorePointer: true }
        );

        particle.setScale(0.8);
        particle.setBlendMode('ADD');
        particle.setFriction(0.005);
        particle.setBounce(0.8);
        particle.setMass(1);
    }

    this.matter.add.image(400, 0, 'block').setBounce(0.8).setMass(60);

    this.matter.add.mouseSpring();
}
