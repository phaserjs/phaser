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
var trees = [];

var game = new Phaser.Game(config);

function preload ()
{
    //  Tree model by Souchiee Blanc (https://poly.google.com/view/3dMllWBdbkc)
    this.load.obj('tree', 'assets/obj/tree2.obj');
}

function create ()
{
    graphics = this.add.graphics();

    graphics.setCameraPosition(0, 6, -60);

    for (var i = 0; i < 32; i++)
    {
        var x = Phaser.Math.Between(-30, 60);
        var z = Phaser.Math.Between(-30, 30);

        var mesh = graphics.createMesh('tree', x, 0, z);
    
        mesh.thickness = 2;

        trees.push(mesh);
    }
}

function update ()
{
    graphics.setCameraTarget(0, 0, graphics.cameraZ + 60);
    graphics.cameraZ += 0.1;

    graphics.clear();

    for (var i = 0; i < trees.length; i++)
    {
        // trees[i].z -= 0.1;

        graphics.strokeMesh(trees[i]);
    }
}
