var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var text;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser.png');
    this.load.image('asuna', 'assets/sprites/asuna_by_vali233.png');
    this.load.image('disk', 'assets/sprites/oz_pov_melting_disk.png');
    this.load.image('tree', 'assets/sprites/palm-tree-left.png');
}

function create ()
{
    text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);

    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', function (pointer) {

        if (pointer.rightButtonDown())
        {
            if (pointer.getDuration() > 500)
            {
                this.add.image(pointer.x, pointer.y, 'disk');
            }
            else
            {
                this.add.image(pointer.x, pointer.y, 'asuna');
            }
        }
        else
        {
            if (pointer.getDuration() > 500)
            {
                this.add.image(pointer.x, pointer.y, 'tree');
            }
            else
            {
                this.add.image(pointer.x, pointer.y, 'logo');
            }
        }

    }, this);
}

function update ()
{
    var pointer = this.input.activePointer;

    text.setText([
        'x: ' + pointer.worldX,
        'y: ' + pointer.worldY,
        'isDown: ' + pointer.isDown,
        'rightButtonDown: ' + pointer.rightButtonDown()
    ]);
}
