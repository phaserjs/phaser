var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
}

function create ()
{
    var height = 400;

    var image = this.add.sprite(100, 300, 'cards').setScale(300 / height).setInteractive();

    this.input.setDraggable(image);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.setScale(gameObject.y / height);

        gameObject.x = pointer.x;
        gameObject.y = pointer.y;

    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {

        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;

    });

    //  A drop zone
    var zone = this.add.zone(500, 300, 300, 500).setDropZone();

    //  Just a visual display of the drop zone
    var graphics = this.add.graphics();
    graphics.lineStyle(2, 0xffff00);
    graphics.strokeRect(zone.x + zone.input.hitArea.x, zone.y + zone.input.hitArea.y, zone.input.hitArea.width, zone.input.hitArea.height);

}
