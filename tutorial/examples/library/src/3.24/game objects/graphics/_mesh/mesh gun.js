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
    //  Battleship model by Robbie Cartwright (https://poly.google.com/view/0lCghGSp-E9)
    this.load.obj('gun', 'assets/obj/gun.obj');
}

function create ()
{
    graphics = this.add.graphics(0, 0);

    mesh = graphics.createMesh('gun', 0, 0, 4);

    mesh.setScale(10);
    // mesh.setBackfaceCull(true);

    mesh.rotation.z = Phaser.Math.DegToRad(140);
}

function update ()
{
    mesh.rotation.y += 0.01;

    graphics.clear();

    graphics.fillMesh(mesh);
    // graphics.strokeMesh(mesh);
}
