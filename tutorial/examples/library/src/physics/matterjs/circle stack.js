class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.balls_images = [];
    }

    preload ()
    {
        this.load.image('ball', 'assets/sprites/shinyball.png');
    }

    create ()
    {
        const Matter = Phaser.Physics.Matter;
        this.matter.world.setBounds();
        this.matter.add.mouseSpring();

        // add bodies
        this.stack = this.matter.add.stack(100, 185, 10, 10, 20, 0, (x, y) => {
            return Matter.Matter.Bodies.circle(x, y, 32/2);
        });

        this.balls_images = this.stack.bodies.map(body => {
            return this.add.image(body.position.x, body.position.y, 'ball');
        });
    }

    update ()
    {
        for (let i = 0; i < this.stack.bodies.length; i++)
        {
            const body = this.stack.bodies[i];
            const ball = this.balls_images[i];

            ball.x = body.position.x;
            ball.y = body.position.y;
            ball.rotation = body.angle;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#1b1464',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
        }
    },
    scene: [ Example ]
};

const game = new Phaser.Game(config);
