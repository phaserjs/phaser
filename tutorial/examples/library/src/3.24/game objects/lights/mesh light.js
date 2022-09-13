var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var quad = {
    topLeftX: -200, topLeftY: -200,
    topRightX: 200, topRightY: -200,
    bottomLeftX: -200, bottomLeftY: 200,
    bottomRightX: 200, bottomRightY: 200
};

var mesh;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('brick', ['assets/normal-maps/brick.jpg', 'assets/normal-maps/brick_n.png']);
}

function create ()
{
    mesh = this.make.mesh({
        key: 'brick',
        x: 400,
        y: 300,
        vertices: [
            quad.topLeftX, quad.topLeftY,
            quad.bottomLeftX, quad.bottomLeftY,
            quad.bottomRightX, quad.bottomRightY,

            quad.topLeftX, quad.topLeftY,
            quad.bottomRightX, quad.bottomRightY,
            quad.topRightX, quad.topRightY
        ],
        uv: [ 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0 ]
    });

    mesh.setPipeline('Light2D');

    this.lights.enable();
    this.lights.setAmbientColor(0x808080);

    var light = this.lights.addLight(400, 300, 300);

    this.input.on('pointermove', function (pointer) {

        light.x = pointer.x;
        light.y = pointer.y;

    });

    tweenQuad();
}

function tweenQuad ()
{
    //  Randomise the coords a little

    var tlX = -200 + Phaser.Math.Between(-90, 90);
    var tlY = -200 + Phaser.Math.Between(-90, 90);

    var trX = 200 + Phaser.Math.Between(-90, 90);
    var trY = -200 + Phaser.Math.Between(-90, 90);

    var blX = -200 + Phaser.Math.Between(-90, 90);
    var blY = 200 + Phaser.Math.Between(-90, 90);

    var brX = 200 + Phaser.Math.Between(-90, 90);
    var brY = 200 + Phaser.Math.Between(-90, 90);

    TweenMax.to(quad, 1.5, {

        topLeftX: tlX,
        topLeftY: tlY,

        topRightX: trX,
        topRightY: trY,

        bottomLeftX: blX,
        bottomLeftY: blY,

        bottomRightX: brX,
        bottomRightY: brY,

        ease: Power2.easeOut,

        onUpdate: function ()
        {
            var verts = mesh.vertices;

            verts[0] = quad.topLeftX;
            verts[1] = quad.topLeftY;
            verts[6] = quad.topLeftX;
            verts[7] = quad.topLeftY;

            verts[10] = quad.topRightX;
            verts[11] = quad.topRightY;

            verts[2] = quad.bottomLeftX;
            verts[3] = quad.bottomLeftY;

            verts[4] = quad.bottomRightX;
            verts[5] = quad.bottomRightY;
            verts[8] = quad.bottomRightX;
            verts[9] = quad.bottomRightY;
        },

        onComplete: tweenQuad

    });
}
