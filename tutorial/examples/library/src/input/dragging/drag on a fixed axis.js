var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('eye', 'assets/pics/lance-overdose-loader-eye.png');
}

function create ()
{
    var image = this.add.sprite(200, 300, 'eye').setInteractive();

    this.input.setDraggable(image);

    //  The pointer has to move 16 pixels before it's considered as a drag
    this.input.dragDistanceThreshold = 8;

    let dragDirection = null;

    this.input.on('dragstart', function (pointer, gameObject) {

        gameObject.setTint(0xff0000);

        dragDirection = null;

    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        if (!dragDirection)
        {
            if (Math.abs(pointer.velocity.x) > Math.abs(pointer.velocity.y))
            {
                dragDirection = 'horizontal';
            }
            else
            {
                dragDirection = 'vertical';
            }
        }

        if (dragDirection  === 'horizontal')
        {
            gameObject.x = dragX;
        }
        else if (dragDirection === 'vertical')
        {
            gameObject.y = dragY;
        }

    });

    this.input.on('dragend', function (pointer, gameObject) {

        dragDirection = null;

        gameObject.clearTint();

    });
}
