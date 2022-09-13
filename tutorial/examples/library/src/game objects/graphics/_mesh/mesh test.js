var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.obj('test', 'assets/obj/tree2.obj');
}

function create ()
{
    console.log(this.cache.obj.get('test'));

    var graphics = this.add.graphics(0, 0);

    var mesh = graphics.createMesh('test', 0, 2, 10);

    // mesh.setScale(0.1);
    mesh.rotation.z = Phaser.Math.DegToRad(180);
    // mesh.thickness = 2;

    graphics.strokeMesh(mesh);
}
