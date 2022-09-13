var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var mesh0;
var time = 0;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('image0', 'assets/pics/checker.png');
}

function create ()
{
    mesh0 = this.make.mesh({
        key: 'image0',
        x: 0,
        y: 0,
        vertices: [
        /*  X   |   Y  */
        /* ----------- */
            0, 0,
            0, 600,
            800, 600,
            0, 0,
            800, 600,
            800, 0
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
        ],
        colors: [0x000000, 0xFFFFFF, 0xFFFFFF, 0x000000, 0xFFFFFF, 0x000000]
    });
}

function update ()
{   
    var factorX = 0.001;
    var factorY = 0.01;

    // top left V
    mesh0.uv[1] += Math.sin(time) * factorX;
    mesh0.uv[7] += Math.sin(time) * factorX;

    // bottom left U
    mesh0.uv[2] += Math.cos(time) * factorY;

    // bottom right U
    mesh0.uv[4] += Math.cos(time) * factorY;
    mesh0.uv[8] += Math.cos(time) * factorY;
    
    // top right V
    mesh0.uv[11] += Math.sin(time) * factorX;

    time += 0.01;
}
