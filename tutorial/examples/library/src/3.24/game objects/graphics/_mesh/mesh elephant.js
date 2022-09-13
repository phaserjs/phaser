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
    //  Elephant model by Alex “SAFFY” Safayan (https://poly.google.com/view/eGI3RS52kJA)
    this.load.obj('elephant', 'assets/obj/elephant.obj');
}

function create ()
{
    graphics = this.add.graphics(0, 0);

    mesh = graphics.createMesh('elephant', 0, 0, 20);

    mesh.rotation.z = Phaser.Math.DegToRad(180);

    mesh.setFillColor(0x0000ff);
    // mesh.setFillAlpha(0.4);
    mesh.setBackfaceCull(true, false);
    mesh.lineStyle(2, 0xffffff, 1);
}

function update ()
{
    mesh.rotation.y += 0.01;

    graphics.clear();

    graphics.fillMesh(mesh);
    graphics.strokeMesh(mesh);
}
