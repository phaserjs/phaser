var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#efefef',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var graphics;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
}

function create ()
{
    //  We need 2 extra pointers, as we only get 1 by default
    this.input.addPointer(2);

    var sprite1 = this.add.sprite(400, 100, 'logo').setInteractive({ draggable: true });

    sprite1.on('drag', function (pointer, dragX, dragY) {

        this.x = dragX;
        this.y = dragY;

    });

    var sprite2 = this.add.sprite(400, 300, 'logo').setInteractive({ draggable: true });

    sprite2.on('drag', function (pointer, dragX, dragY) {

        this.x = dragX;
        this.y = dragY;

    });

    var sprite3 = this.add.sprite(400, 500, 'logo').setInteractive({ draggable: true });

    sprite3.on('drag', function (pointer, dragX, dragY) {

        this.x = dragX;
        this.y = dragY;

    });

    graphics = this.add.graphics();

    this.add.text(10, 10, 'Multi touch drag test', { font: '16px Courier', fill: '#000000' });
}

function update ()
{
    if (this.input.pointer1.isDown || this.input.pointer2.isDown || this.input.pointer3.isDown)
    {
        graphics.clear();
    }

    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(this.input.pointer1.x, this.input.pointer1.y, 44, 44);

    graphics.fillStyle(0x00ff00, 1);
    graphics.fillRect(this.input.pointer2.x, this.input.pointer2.y, 44, 44);

    graphics.fillStyle(0x0000ff, 1);
    graphics.fillRect(this.input.pointer3.x, this.input.pointer3.y, 44, 44);
}
