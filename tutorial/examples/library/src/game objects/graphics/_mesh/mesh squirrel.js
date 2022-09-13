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
    this.load.obj('squirrel', 'assets/obj/squirrel.obj');
}

function create ()
{
    graphics = this.add.graphics(0, 0);

    mesh = graphics.createMesh('squirrel', 0, 0, 13);

    mesh.setScale(10);

    mesh.rotation.z = Phaser.Math.DegToRad(180);

    mesh.thickness = 2;
}

function update ()
{
    mesh.rotation.y += 0.01;

    graphics.clear();

    graphics.strokeMesh(mesh);
}
