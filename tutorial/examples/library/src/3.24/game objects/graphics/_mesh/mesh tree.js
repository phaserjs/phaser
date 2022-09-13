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
    //  Tree model by Frank Lynam (https://poly.google.com/view/6FZA6RpTruf)
    this.load.obj('tree', 'assets/obj/tree2.obj');
}

function create ()
{
    graphics = this.add.graphics(0, 0);

    // mesh = graphics.createMesh('tree', 0, 0, 20).setScale(10);
    mesh = graphics.createMesh('tree', 0, 2, 14);

    mesh.rotation.z = Phaser.Math.DegToRad(140);

    mesh.thickness = 2;
}

function update ()
{
    mesh.rotation.y += 0.01;

    graphics.clear();

    graphics.strokeMesh(mesh);
}
