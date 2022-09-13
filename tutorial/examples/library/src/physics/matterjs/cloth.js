class Example extends Phaser.Scene {
    constructor() {
        super();
    }

    preload()
    {
        this.load.image('ball', 'assets/sprites/crate32.png');
        this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
    }

    create()
    {
        this.blitter = this.add.blitter(0, 0, 'balls');

        this.matter.world.setBounds();
        this.matter.add.mouseSpring();

        const group = this.matter.world.nextGroup(true);

        const particleOptions = { friction: 0.00001, collisionFilter: { group: group }, render: { visible: false } };
        const constraintOptions = { stiffness: 0.06 };

        // softBody: function (x, y, columns, rows, columnGap, rowGap, crossBrace, particleRadius, particleOptions, constraintOptions)

        this.cloth = this.matter.add.softBody(200, 140, 20, 12, 5, 5, false, 8, particleOptions, constraintOptions);

        let f = 0;
        for (let i = 0; i < this.cloth.bodies.length; i++) {
            const body = this.cloth.bodies[i];

            if (i < 20) {
                body.isStatic = true;
            }

            // if (i % 20 === 0) {
            //     f++;

            //     if (f > 5) {
            //         f = 0;
            //     }
            // }

            // body.gameObject = this.blitter.create(body.position.x, body.position.y, f);
        }

        const circle = this.matter.add.circle(300, 500, 80, { isStatic: true,  chamfer: { radius: 20 } });
        // this.matter.world.add(circle);
        // console.log(this.matter.world)
        this.matter.add.rectangle(500, 480, 80, 80, { isStatic: true });
        this.matter.add.rectangle(400, 609, 800, 50, { isStatic: true });
    }

    update()
    {
        // for (let i = 0; i < this.cloth.bodies.length; i++) {
        //     const body = this.cloth.bodies[i];

        //     body.gameObject.x = body.position.x;
        //     body.gameObject.y = body.position.y;
        // }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            debugBodyColor: 0xffffff
        }
    },
    scene: [ Example]
};

const game = new Phaser.Game(config);
