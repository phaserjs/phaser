class Example extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    create()
    {
        this.matter.world.setBounds();

        // First, we'll create a few static bodies
        const body1 = this.matter.add.rectangle(250, 50, 200, 32, { isStatic: true });

        this.matter.add.polygon(600, 100, 3, 40, { isStatic: true });
        this.matter.add.polygon(100, 500, 8, 50, { isStatic: true });
        this.matter.add.rectangle(750, 200, 16, 180, { isStatic: true });

        //  Now a body that shows off internal edges + convex hulls
        const star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38';

        this.matter.add.fromVertices(700, 500, star, { restitution: 0.9 }, true);

        // Some different joint types
        const body2 = this.matter.add.circle(150, 250, 16);
        const body3 = this.matter.add.circle(400, 450, 16);
        const body4 = this.matter.add.circle(500, 50, 16);

        // A spring, because length > 0 and stiffness < 0.9
        this.matter.add.spring(body1, body2, 140, 0.001);

        // A joint, because length > 0 and stiffness > 0.1
        this.matter.add.worldConstraint(body3, 140, 1, {
            pointA: {
                x: 400, y: 250
            }
        });

        // A pin, because length = 0 and stiffness > 0.1
        this.matter.add.worldConstraint(body4, 0, 1, {
            pointA: {
                x: 500, y: 50
            }
        });

        // Finally some random dynamic bodies
        for (let i = 0; i < 12; i++)
        {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);

            if (Math.random() < 0.5)
            {
                const sides = Phaser.Math.Between(3, 14);
                const radius = Phaser.Math.Between(8, 50);

                this.matter.add.polygon(x, y, sides, radius, { restitution: 0.9 });
            }
            else
            {
                const width = Phaser.Math.Between(16, 128);
                const height = Phaser.Math.Between(8, 64);

                this.matter.add.rectangle(x, y, width, height, { restitution: 0.9 });
            }
        }

        this.input.on('pointerdown', function (pointer, gameObject) {
            const bodies = this.matter.intersectPoint(pointer.worldX, pointer.worldY);
            if (bodies.length)
            {
                console.log(bodies);
            }
        }, this);
    }
}

const config = {
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
    scene: [ Example ]
};

const game = new Phaser.Game(config);
