var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var mesh;
var time = 0;

//  Values given in pixels relative to the mesh x/y (the center)

var topLeft = { x: -100, y: -100 };
var topRight = { x: 100, y: -100 };
var bottomLeft = { x: -100, y: 100 };
var bottomRight = { x: 100, y: 100 };

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('image1', 'assets/pics/acryl-bladerunner.png');
}

function create ()
{
    //  A quad is made up of 2 triangles (A and B in the image below)
    //
    //  0 = Bottom Left (-1, -1)
    //  1 = Bottom Right (1, -1)
    //  2 = Top Left (-1, 1)
    //  3 = Top Right (1, 1)
    //
    //  2----3
    //  |\  B|
    //  | \  |
    //  |  \ |
    //  | A \|
    //  |    \
    //  0----1

    mesh = this.make.mesh({
        key: 'image1',
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

function update ()
{   
    var factorX = 20 * 0.1;
    var factorY = 5 * 0.1;

    mesh.vertices[2] += Math.cos(time) * factorX;
    mesh.vertices[3] += Math.sin(time) * factorY;
    mesh.vertices[4] += Math.cos(time) * factorX;
    mesh.vertices[5] += Math.sin(time) * factorY;
    mesh.vertices[8] += Math.cos(time) * factorX;
    mesh.vertices[9] += Math.sin(time) * factorY;

    time += 0.01;
}
