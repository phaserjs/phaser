var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ayu', 'assets/pics/ayu2.png');
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
}

function create ()
{
    //  Create a stack of random cards

    var frames = this.textures.get('cards').getFrameNames();

    var x = 100;
    var y = 100;

    for (var i = 0; i < 64; i++)
    {
        var image = this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive();

        this.input.setDraggable(image);

        y += 6;
    }

    //  A drop zone
    var zone = this.add.image(500, 300, 'ayu').setInteractive();

    zone.input.dropZone = true;

    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);

    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });

    this.input.on('dragenter', function (pointer, gameObject, dropZone) {

        zone.setTint(0x00ff00);

    });

    this.input.on('dragleave', function (pointer, gameObject, dropZone) {

        zone.clearTint();

    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {

        gameObject.x = dropZone.x;
        gameObject.y = dropZone.y;
        gameObject.setScale(0.2);

        gameObject.input.enabled = false;

        zone.clearTint();

    });

    this.input.on('dragend', function (pointer, gameObject, dropped) {

        if (!dropped)
        {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
        }

    });

}