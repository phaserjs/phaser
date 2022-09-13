class Example extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    create()
    {
        const body1 = this.matter.add.polygon(100, 300, 8, 70, { isStatic: true });
        const body2 = this.matter.add.fromVertices(300, 300, '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38', {}, true);
        const body3 = this.matter.add.polygon(500, 300, 3, 60);
        const body4 = this.matter.add.rectangle(700, 300, 48, 256);

        const fillOver = 0xff0000;
        const strokeOver = 0xffff00;
        const lineThicknessOver = 4;

        const bodies = [ body1, body2, body3, body4 ];

        this.input.on('pointermove', function (pointer) {
            const x = pointer.worldX;
            const y = pointer.worldY;

            for (let i = 0; i < bodies.length; i++)
            {
                const body = bodies[i];

                if (this.matter.containsPoint(body, x, y))
                {
                    this.matter.world.setBodyRenderStyle(body, fillOver, strokeOver, lineThicknessOver);
                }
                else
                {
                    this.matter.world.setBodyRenderStyle(body);
                }
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
