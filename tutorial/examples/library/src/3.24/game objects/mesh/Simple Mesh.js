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

var mesh0;
var mesh1;
var mesh2;
var time = 0;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('image0', 'assets/pics/1984-nocooper-space.png');
    this.load.image('image1', 'assets/pics/acryl-bladerunner.png');
    this.load.image('image2', 'assets/pics/acryl-bobablast.png');
}

function create ()
{
    mesh0 = this.make.mesh({
        key: 'image0',
        x: 400,
        y: 250,
        vertices: [
        /*  X   |   Y  */
        /* ----------- */
            -150, -150,
            -300, 150,
            300, 150,

            -150, -150,
            300, 150,
            150, -150
        ],
        uv: [
        /*  U   |   V  */
        /* ----------- */
            0,      0,
            0,      1,
            1,      1,
            
            0,      0,
            1,      1,
            1,      0
        ]
    });

    mesh1 = this.make.mesh({
        key: 'image1',
        x: 80,
        y: 250,
        vertices: [
        /*  X   |   Y  */
        /* ----------- */
            -150, -150,
            -350, 150,
            -5, 150,

            -150, -150,
            -5, 150,
            150, -150
        ],
        uv: [
        /*  U   |   V  */
        /* ----------- */
            0,      0,
            0,      1,
            1,      1,
            
            0,      0,
            1,      1,
            1,      0
        ]
    });

    mesh2 = this.make.mesh({
        key: 'image2',
        x: 720,
        y: 250,
        vertices: [
        /*  X   |   Y  */
        /* ----------- */
            -150, -150,
            5, 150,
            350, 150,

            -150, -150,
            300, 150,
            150, -150
        ],
        uv: [
        /*  U   |   V  */
        /* ----------- */
            0,      0,
            0,      1,
            1,      1,
            
            0,      0,
            1,      1,
            1,      0
        ]
    });
}

function update ()
{   
    var factorX = 20 * 0.1;
    var factorY = 5 * 0.1;

    mesh0.vertices[2] += Math.cos(time) * factorX;
    mesh0.vertices[3] += Math.sin(time) * factorY;
    mesh0.vertices[4] += Math.cos(time) * factorX;
    mesh0.vertices[5] += Math.sin(time) * factorY;
    mesh0.vertices[8] += Math.cos(time) * factorX;
    mesh0.vertices[9] += Math.sin(time) * factorY;

    mesh1.vertices[2] += Math.cos(time) * factorX;
    mesh1.vertices[3] += Math.sin(time) * factorY;
    mesh1.vertices[4] += Math.cos(time) * factorX;
    mesh1.vertices[5] += Math.sin(time) * factorY;
    mesh1.vertices[8] += Math.cos(time) * factorX;
    mesh1.vertices[9] += Math.sin(time) * factorY;

    mesh2.vertices[2] += Math.cos(time) * factorX;
    mesh2.vertices[3] += Math.sin(time) * factorY;
    mesh2.vertices[4] += Math.cos(time) * factorX;
    mesh2.vertices[5] += Math.sin(time) * factorY;
    mesh2.vertices[8] += Math.cos(time) * factorX;
    mesh2.vertices[9] += Math.sin(time) * factorY;

    time += 0.01;
}
