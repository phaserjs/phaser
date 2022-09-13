class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        this.matter.world.setBounds();

        //  First, we'll create a few static bodies
        const body1 = this.matter.add.rectangle(250, 50, 200, 32, { isStatic: true });
    
        this.matter.add.polygon(600, 100, 3, 40, { isStatic: true });
        this.matter.add.polygon(100, 500, 8, 50, { isStatic: true });
        this.matter.add.rectangle(750, 200, 16, 180, { isStatic: true });
    
        //  Now a body that shows off internal edges + convex hulls
        const star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38';
    
        this.matter.add.fromVertices(700, 500, star, { restitution: 0.5 }, true);
    
        //  Some different joint types
        const body2 = this.matter.add.circle(150, 250, 16);
        const body3 = this.matter.add.circle(400, 450, 16);
        const body4 = this.matter.add.circle(500, 50, 16);
        
        //  A spring, because length > 0 and stiffness < 0.9
        this.matter.add.spring(body1, body2, 140, 0.001);
    
        //  A joint, because length > 0 and stiffness > 0.1
        this.matter.add.worldConstraint(body3, 140, 1, { pointA: { x: 400, y: 250 }});
    
        //  A pin, because length = 0 and stiffness > 0.1
        this.matter.add.worldConstraint(body4, 0, 1, { pointA: { x: 500, y: 50 }});
    
        //  Finally some random dynamic bodies
        for (let i = 0; i < 12; i++)
        {
            let x = Phaser.Math.Between(100, 700);
            let y = Phaser.Math.Between(100, 500);
    
            if (Math.random() < 0.5)
            {
                let sides = Phaser.Math.Between(3, 14);
                let radius = Phaser.Math.Between(8, 50);
    
                this.matter.add.polygon(x, y, sides, radius, { restitution: 0.5 });
            }
            else
            {
                let width = Phaser.Math.Between(16, 128);
                let height = Phaser.Math.Between(8, 64);
    
                this.matter.add.rectangle(x, y, width, height, { restitution: 0.5 });
            }
        }
    
        this.matter.add.mouseSpring();
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
    scene: Example
};

let game = new Phaser.Game(config);
