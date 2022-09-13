var config = {
    width: 800,
    height: 600,
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var text;

var game = new Phaser.Game(config);

function create ()
{
    text = this.add.text(10, 10, '', { fill: '#00ff00' }).setDepth(1);

    this.input.mouse.disableContextMenu();
}

function update ()
{
    var pointer = this.input.activePointer;

    text.setText([
        'x: ' + pointer.worldX,
        'y: ' + pointer.worldY,
        'isDown: ' + pointer.isDown,
        'rightButtonDown: ' + pointer.rightButtonDown(),
        'downTime: ' + pointer.getDuration()
    ]);
}
