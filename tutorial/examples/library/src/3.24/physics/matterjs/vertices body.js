var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            debug: {
                renderFill: false,
                showInternalEdges: true,
                showConvexHulls: true
            }
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    this.matter.world.setBounds().disableGravity();

    var arrow = '40 0 40 20 100 20 100 80 40 80 40 100 0 50';
    var chevron = '100 0 75 50 100 100 25 100 0 50 25 0';
    var star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38';

    var poly = this.add.polygon(400, 300, arrow, 0x0000ff, 0.2);

    this.matter.add.gameObject(poly, { shape: { type: 'fromVerts', verts: arrow, flagInternal: true } });

    poly.setVelocity(6, 3);
    poly.setAngularVelocity(0.01);
    poly.setBounce(1);
    poly.setFriction(0, 0, 0);

    var poly = this.add.polygon(400, 100, chevron, 0xff0000, 0.2);

    this.matter.add.gameObject(poly, { shape: { type: 'fromVerts', verts: chevron, flagInternal: true } });

    poly.setVelocity(6, 3);
    poly.setAngularVelocity(0.01);
    poly.setBounce(1);
    poly.setFriction(0, 0, 0);

    var poly = this.add.polygon(600, 400, star, 0x00ff00, 0.2);

    this.matter.add.gameObject(poly, { shape: { type: 'fromVerts', verts: star, flagInternal: true } });

    poly.setVelocity(4, -2);
    poly.setBounce(1);
    poly.setFriction(0, 0, 0);
    poly.setFrictionAir(0.005);
}
