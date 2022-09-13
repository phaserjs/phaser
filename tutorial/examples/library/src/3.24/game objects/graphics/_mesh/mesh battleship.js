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
    //  Battleship model by angelo raffaele Catalano (https://poly.google.com/view/cqV6mUkn7Ow)
    this.load.obj('battleship', 'assets/obj/battleship.obj');
}

function create ()
{
    graphics = this.add.graphics(0, 0);

    mesh = graphics.createMesh('battleship', 0, 3, 40);

    mesh.rotation.z = Phaser.Math.DegToRad(180);
}

function update ()
{
    mesh.rotation.y += 0.01;

    graphics.clear();

    graphics.strokeMesh(mesh);
}
