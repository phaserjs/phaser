var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4d4d4d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: false,
            gravity: {
                y: 0
            },
            debug: {}
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    this.matter.world.setBounds();

    //  First, we'll create a few static bodies
    var body1 = this.matter.add.rectangle(250, 50, 200, 32, { isStatic: true });

    this.matter.add.polygon(600, 100, 3, 40, { isStatic: true });
    this.matter.add.polygon(100, 500, 8, 50, { isStatic: true });
    this.matter.add.rectangle(750, 200, 16, 180, { isStatic: true });

    //  Now a body that shows off internal edges + convex hulls
    var star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38';

    this.matter.add.fromVertices(700, 500, star, { restitution: 0.9 }, true);

    //  Some different joint types
    var body2 = this.matter.add.circle(150, 250, 16);
    var body3 = this.matter.add.circle(400, 450, 16);
    var body4 = this.matter.add.circle(500, 50, 16);
    
    //  A spring, because length > 0 and stiffness < 0.9
    this.matter.add.spring(body1, body2, 140, 0.001);

    //  A joint, because length > 0 and stiffness > 0.1
    this.matter.add.worldConstraint(400, 250, body3, 140, 1);

    //  A pin, because length = 0 and stiffness > 0.1
    this.matter.add.worldConstraint(500, 50, body4, 0, 1);

    //  Finally some random dynamic bodies

    for (var i = 0; i < 12; i++)
    {
        var x = Phaser.Math.Between(100, 700);
        var y = Phaser.Math.Between(100, 500);

        if (Math.random() < 0.5)
        {
            var sides = Phaser.Math.Between(3, 14);
            var radius = Phaser.Math.Between(8, 50);

            this.matter.add.polygon(x, y, sides, radius, { restitution: 0.9 });
        }
        else
        {
            var width = Phaser.Math.Between(16, 128);
            var height = Phaser.Math.Between(8, 64);

            this.matter.add.rectangle(x, y, width, height, { restitution: 0.9 });
        }
    }

    this.input.on('pointerdown', function (pointer) {

        var bodies = this.matter.getBodiesBelowPoint(pointer.worldX, pointer.worldY);

        console.log(bodies);

        if (bodies.length)
        {
        }

    }, this);
}
