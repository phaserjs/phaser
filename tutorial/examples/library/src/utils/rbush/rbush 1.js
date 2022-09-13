var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ship', 'assets/sprites/phaser-ship.png');
}

function create ()
{
    //  Create an RTree

    var tree = new Phaser.Structs.RTree();

    for (var i = 0; i < 512; i++)
    {
        var ship = this.add.image(Phaser.Math.Between(0, 800), Phaser.Math.Between(0, 590), 'ship');

        var bounds = ship.getBounds();

        //  Insert our entry into the RTree:
        tree.insert({ left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom, sprite: ship });
    }

    var debug = this.add.graphics();

    debug.lineStyle(1, 0x00ff00);

    var results = [];

    this.input.on('pointermove', function (pointer) {

        //  First clear the previous results
        results.forEach(function(entry) {

            entry.sprite.setTint(0xffffff);

        });

        debug.clear();

        //  Update the search area

        var bbox = {
            minX: pointer.x - 100,
            minY: pointer.y - 100,
            maxX: pointer.x + 100,
            maxY: pointer.y + 100
        };

        //  Search the RTree

        results = tree.search(bbox);

        //  Set Tint on intersecting Sprites

        results.forEach(function(entry) {

            entry.sprite.setTint(0xff0000);

        });

        //  Draw debug

        debug.strokeRect(bbox.minX, bbox.minY, 200, 200);

    }, this);
}
