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

var text1;
var text2;

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
    text1 = this.add.text(10, 10, '', { fill: '#00ff00' });
    text2 = this.add.text(500, 10, '', { fill: '#00ff00' });

    this.input.mouse.disableContextMenu();

    this.input.on('pointerup', function (pointer) {

        if (pointer.leftButtonReleased())
        {
            text2.setText('Left Button was released');
        }
        else if (pointer.rightButtonReleased())
        {
            text2.setText('Right Button was released');
        }
        else if (pointer.middleButtonReleased())
        {
            text2.setText('Middle Button was released');
        }
        else if (pointer.backButtonReleased())
        {
            text2.setText('Back Button was released');
        }
        else if (pointer.forwardButtonReleased())
        {
            text2.setText('Forward Button was released');
        }

    });
}

function update ()
{
    var pointer = this.input.activePointer;

    text1.setText([
        'x: ' + pointer.worldX,
        'y: ' + pointer.worldY,
        'isDown: ' + pointer.isDown
    ]);
}
