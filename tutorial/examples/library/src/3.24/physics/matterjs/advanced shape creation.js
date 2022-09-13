/*
 *  This example show how to load complex shapes created with PhysicsEditor (https://www.codeandweb.com/physicseditor)
 */

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 600,
    height: 800,
    scene: {
        preload: preload,
        create: create
    },
    physics: {
        default: 'matter',
        matter: {
            debug: true
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    //  Load sprite sheet generated with TexturePacker
    this.load.atlas('sheet', 'assets/physics/fruit-sprites.png', 'assets/physics/fruit-sprites.json');

    //  Load body shapes from JSON file generated using PhysicsEditor
    this.load.json('shapes', 'assets/physics/fruit-shapes.json');
}

function create ()
{
    this.matter.world.setBounds(0, 0, 600, 800);

    var shapes = this.cache.json.get('shapes');

    this.add.image(0, 0, 'sheet', 'background').setOrigin(0, 0);

    var ground = this.matter.add.sprite(0, 0, 'sheet', 'ground', { shape: shapes.ground });

    this.matter.alignBody(ground, 300, 800, Phaser.Display.Align.BOTTOM_CENTER);

    this.matter.add.sprite(200, 50, 'sheet', 'crate', { shape: shapes.crate });
    this.matter.add.sprite(250, 250, 'sheet', 'banana', { shape: shapes.banana });
    this.matter.add.sprite(360, 50, 'sheet', 'orange', { shape: shapes.orange });
    this.matter.add.sprite(400, 250, 'sheet', 'cherries', { shape: shapes.cherries });

    var shapeKeys = [ 'crate', 'banana', 'orange', 'cherries' ];

    this.input.on('pointerdown', function (pointer)
    {
        var fruit = Phaser.Utils.Array.GetRandom(shapeKeys);

        this.matter.add.image(pointer.x, pointer.y, 'sheet', fruit, { shape: shapes[fruit] });

    }, this);
}
