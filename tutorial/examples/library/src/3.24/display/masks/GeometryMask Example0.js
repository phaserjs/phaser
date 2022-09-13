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
    this.load.image('image', 'assets/pics/sao-sinon.png');
    this.load.image('phaser2', 'assets/sprites/phaser2.png');
}

function create ()
{

    var img = this.make.image({x: 400, y: 300, key: 'image'});

    mesh = this.make.mesh({
        key: 'phaser2',
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
        uv: [ 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0 ],
        add: false
    });

    img.mask = new Phaser.Display.Masks.GeometryMask(this, mesh);

    this.tweens.add({
        targets: quad,
        duration: 1500,
        repeat: -1,
        ease: 'Elastic.easeOut',

        topLeftX: function() { return -200 + Phaser.Math.Between(-90, 90); },
        topLeftY: function() { return -200 + Phaser.Math.Between(-90, 90); },

        topRightX: function() { return 200 + Phaser.Math.Between(-90, 90); },
        topRightY: function() { return -200 + Phaser.Math.Between(-90, 90); },

        bottomLeftX: function() { return -200 + Phaser.Math.Between(-90, 90); },
        bottomLeftY: function() { return 200 + Phaser.Math.Between(-90, 90); },

        bottomRightX: function() { return 200 + Phaser.Math.Between(-90, 90); },
        bottomRightY: function() { return 200 + Phaser.Math.Between(-90, 90); },

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
        }

    });
}
