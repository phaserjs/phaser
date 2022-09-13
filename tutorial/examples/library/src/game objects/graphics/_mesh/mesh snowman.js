var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var graphics;
var mesh;

var game = new Phaser.Game(config);

function preload ()
{
    //  Snowman model by Hayden Lee (https://poly.google.com/view/caRR-PnS0-_)
    this.load.obj('snowman', 'assets/obj/snowman.obj');
}

function create ()
{
    graphics = this.add.graphics(0, 0);

    mesh = graphics.createMesh('snowman', 0, 0, 30).setScale(10);

    mesh.rotation.z = Phaser.Math.DegToRad(180);

    mesh.thickness = 2;
}

function update ()
{
    mesh.rotation.y += 0.03;

    graphics.clear();

    graphics.strokeMesh(mesh);
}
