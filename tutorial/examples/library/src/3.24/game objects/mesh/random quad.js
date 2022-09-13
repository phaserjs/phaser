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

    var topLeft = { x: -200, y: -200 };
    var topRight = { x: 200, y: -200 };
    var bottomLeft = { x: -200, y: 200 };
    var bottomRight = { x: 200, y: 200 };

    //  Randomise the coords a little

    topLeft.x += Phaser.Math.Between(-80, 80);
    topLeft.y += Phaser.Math.Between(-80, 80);

    topRight.x += Phaser.Math.Between(-80, 80);
    topRight.y += Phaser.Math.Between(-80, 80);

    bottomLeft.x += Phaser.Math.Between(-80, 80);
    bottomLeft.y += Phaser.Math.Between(-80, 80);

    bottomRight.x += Phaser.Math.Between(-80, 80);
    bottomRight.y += Phaser.Math.Between(-80, 80);

    this.make.mesh({
        key: 'image',
        x: 400,
        y: 300,
        vertices: [
            topLeft.x, topLeft.y,
            bottomLeft.x, bottomLeft.y,
            bottomRight.x, bottomRight.y,

            topLeft.x, topLeft.y,
            bottomRight.x, bottomRight.y,
            topRight.x, topRight.y
        ],
        uv: [ 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0 ]
    });
}
