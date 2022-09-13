var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    disableContextMenu: true,
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
    this.load.image('mouse', 'assets/sprites/mouse_jim_sachs.png');
}

function create ()
{
    this.add.sprite(0, 600, 'mouse').setOrigin(0, 1);

    text = this.add.text(10, 10, '', { fill: '#00ff00' });
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
