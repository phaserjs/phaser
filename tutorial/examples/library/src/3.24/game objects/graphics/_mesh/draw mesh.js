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
    this.load.obj('logo', 'assets/text/phaser-logo-3d.obj');
}

function create ()
{
    graphics = this.add.graphics(0, 0);

    mesh = graphics.createMesh('logo', 0, 0, 40);

    mesh.rotation.z = Phaser.Math.DegToRad(180);

    mesh.thickness = 2;
}

function update ()
{
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.03;

    graphics.clear();

    graphics.strokeMesh(mesh);
}
