var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('image', 'assets/pics/sao-sinon.png');
}

function create ()
{
    //  A          A----C
    //  |\         \  2 |
    //  | \         \   |
    //  |  \         \  |
    //  | 1 \         \ |
    //  |    \         \|
    //  B----C          B

    //  The mesh x/y defines the center of the mesh.
    //  Vertice coordinates are relative to that.

    var tri1 = {
        a: { x: -250, y: -250 },
        b: { x: -250, y: 250 },
        c: { x: 200, y: 250 }
    };

    var tri2 = {
        a: { x: -200, y: -250 },
        b: { x: 250, y: 250 },
        c: { x: 250, y: -250 }
    };

    this.make.mesh({
        key: 'image',
        x: 400,
        y: 300,
        vertices: [
            tri1.a.x, tri1.a.y,
            tri1.b.x, tri1.b.y,
            tri1.c.x, tri1.c.y,

            tri2.a.x, tri2.a.y,
            tri2.b.x, tri2.b.y,
            tri2.c.x, tri2.c.y
        ],
        uv: [
            0, 0, 0, 1, 1, 1, 
            0, 0, 1, 1, 1, 0
        ]
    });
}
