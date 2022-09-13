class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        // this.matter.world.setBounds().disableGravity();
        this.matter.world.disableGravity();

        this.matter.add.mouseSpring();

        let x = 100;
        let y = 300;
        let prevBody;

        for (let i = 0; i < 8; i++)
        {
            const body = this.matter.add.circle(x, y, 24);

            if (i > 0)
            {
                const s = this.matter.add.spring(body, prevBody, 48, 0.9, { damping: 0.9, angularStiffness: 0.9 });

                console.log(s);
            }

            prevBody = body;
            x += 64;
        }
    }

    update ()
    {
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
            enableSleeping: true,
            debug: {

                showAxes: false,
                showAngleIndicator: true,
                angleColor: 0xe81153,

                showBroadphase: false,
                broadphaseColor: 0xffb400,

                showBounds: false,
                boundsColor: 0xffffff,

                showVelocity: true,
                velocityColor: 0x00aeef,

                showCollisions: true,
                collisionColor: 0xf5950c,

                showSeparations: false,
                separationColor: 0xffa500,

                showBody: true,
                showStaticBody: true,
                showInternalEdges: true,

                renderFill: false,
                renderLine: true,

                fillColor: 0x106909,
                fillOpacity: 1,
                lineColor: 0x28de19,
                lineOpacity: 1,
                lineThickness: 1,

                staticFillColor: 0x0d177b,
                staticLineColor: 0x1327e4,

                showSleeping: true,
                staticBodySleepOpacity: 1,
                sleepFillColor: 0x464646,
                sleepLineColor: 0x999a99,

                showSensors: true,
                sensorFillColor: 0x0d177b,
                sensorLineColor: 0x1327e4,

                showPositions: true,
                positionSize: 4,
                positionColor: 0xe042da,

                showJoint: true,
                jointColor: 0xe0e042,
                jointLineOpacity: 1,
                jointLineThickness: 2,

                pinSize: 4,
                pinColor: 0x42e0e0,

                springColor: 0xe042e0,

                anchorColor: 0xefefef,
                anchorSize: 4,

                showConvexHulls: true,
                hullColor: 0xd703d0
            }
        }
    },
    scene: [ Example ]
};

const game = new Phaser.Game(config);
