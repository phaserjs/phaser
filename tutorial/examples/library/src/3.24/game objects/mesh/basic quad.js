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
    //  A quad is made up of 2 triangles (A and B in the image below)
    //  The two triangles share points 1 and 2 to keep the quad joined.
    //
    //  2----3
    //  |\  B|
    //  | \  |
    //  |  \ |
    //  | A \|
    //  |    \
    //  0----1

    //  The mesh x/y defines the center of the mesh.
    //  Vertice coordinates are relative to that.

    //  Values given in pixels relative to the mesh x/y (the center)
    //  This creates a 500 x 500 px quad

    //  Try changing some of these values :)

    var topLeft = { x: -250, y: -250 };
    var topRight = { x: 250, y: -250 };
    var bottomLeft = { x: -250, y: 250 };
    var bottomRight = { x: 250, y: 250 };

    var vertices = [
        topLeft.x, topLeft.y,
        bottomLeft.x, bottomLeft.y,
        bottomRight.x, bottomRight.y,

        topLeft.x, topLeft.y,
        bottomRight.x, bottomRight.y,
        topRight.x, topRight.y
    ];
    var uv = [ 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0 ];

    this.add.mesh(400, 300, 'image', null, vertices, uv);
}
