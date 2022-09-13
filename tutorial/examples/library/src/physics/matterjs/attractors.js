var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                scale: 0
            },
            plugins: {
                attractors: true
            }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sun', 'assets/tests/space/sun.png');
    this.load.image('alien', 'assets/sprites/space-baddie.png');
}

function create ()
{
    //  You can enable the Attractors plugin either via the game config (see above), or explicitly in code:
    // this.matter.enableAttractorPlugin();

    this.matter.world.setBounds();

    this.matter.add.imageStack('alien', null, 0, 500, 50, 2, 0, 0, {
        mass: 1,
        ignorePointer: true
    });

    var sun = this.matter.add.image(400, 200, 'sun', null, {
        shape: {
            type: 'circle',
            radius: 64
        },
        plugin: {
            attractors: [
                function (bodyA, bodyB) {
                    return {
                        x: (bodyA.position.x - bodyB.position.x) * 0.000001,
                        y: (bodyA.position.y - bodyB.position.y) * 0.000001
                    };
                }
            ]
        }
    });

    this.matter.add.mouseSpring();
}
