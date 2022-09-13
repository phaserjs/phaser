class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    create ()
    {
        this.matter.world.setBounds(0, 0, 800, 600);
        this.matter.add.mouseSpring({ stiffness: 0.1 });

        const verts = [
          { x: 50, y: 0 },
          { x: 100, y: 60 },
          { x: 0, y: 75 }
        ];

        //  This will work properly because the vertices are
        //  centered around 0x0

        const body = this.matter.add.fromVertices(300, 300, verts);

        const poly = this.add.polygon(body.position.x, body.position.y, verts, 0x8d8d8d);

        //  Tell the Game Object to use the existing body, don't create a new one
        this.matter.add.gameObject(poly, body, false);

        //  In this case the verts are not centered, so we cannot
        //  use them to create the Polygon from. Instead we create
        //  the body first and use _those_ verts to create the Polygon

        const verts2 = [
            { x: 0, y: -50 },
            { x: 50, y: 10 },
            { x: -50, y: 25 }
        ];

        const body2 = this.matter.add.fromVertices(500, 300, verts2);

        const polyVerts = [];

        const bx = body2.position.x;
        const by = body2.position.y;

        const cx = body2.centerOffset.x;
        const cy = body2.centerOffset.y;

        body2.vertices.forEach(vert => {
            polyVerts.push({ x: vert.x - bx + cx, y: vert.y - by + cy });
        });

        const poly2 = this.add.polygon(bx, by, polyVerts, 0x8d8d8d);

        //  Account for the fact that in this set of verts, the
        //  origin isn't the center
        poly2.setDisplayOrigin(cx, cy);

        this.matter.add.gameObject(poly2, body2, false);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Example,
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug: {

                showAngleIndicator: true,
                angleColor: 0xe81153,

                showVelocity: true,
                velocityColor: 0x00aeef,

                showCollisions: true,
                collisionColor: 0xf5950c,

                showBody: true,
                showInternalEdges: true,

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
    }
};

const game = new Phaser.Game(config);
