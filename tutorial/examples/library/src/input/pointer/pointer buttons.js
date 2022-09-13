var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    disableContextMenu: true,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    var graphics = this.add.graphics();

    var color = 0xffff00;
    var thickness = 2;
    var alpha = 1;

    //  Events

    var sx = 0;
    var sy = 0;
    var draw = false;

    //  Stop the right-click from triggering the context menu
    //  You can also set this in the game config
    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', function (pointer) {

        sx = pointer.x;
        sy = pointer.y;
        draw = true;

        if (pointer.leftButtonDown() && pointer.rightButtonDown())
        {
            color = 0x00ffff;
        }
        else if (pointer.leftButtonDown())
        {
            color = 0xffff00;
        }
        else if (pointer.rightButtonDown())
        {
            color = 0x00ff00;
        }

    });

    this.input.on('pointerup', function () {

        draw = false;

    });

    this.input.on('pointermove', function (pointer) {

        if (draw && pointer.noButtonDown() === false)
        {
            graphics.clear();
            graphics.lineStyle(thickness, color, alpha);
            graphics.strokeRect(sx, sy, pointer.x - sx, pointer.y - sy);
        }

    });
}
