var config = {
    type: Phaser.CANVAS,
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
    this.load.obj('plane', 'assets/obj/plane.obj');
}

function create ()
{
    graphics = this.add.graphics();

    mesh = graphics.createMesh('plane', 0, 0, 2);

    mesh.setScale(4);
    mesh.setFillColor(0x0000ff);
}

function update ()
{
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.03;

    graphics.clear();

    graphics.fillMesh(mesh);
    graphics.strokeMesh(mesh);
}
