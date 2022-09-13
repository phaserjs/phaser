var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var group;
var rect;
var i = 0;

function preload ()
{
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    rect = new Phaser.Geom.Rectangle(64, 32, 100, 512);

    group = this.add.group({ key: 'balls', frame: [0,1,2,3,4,5], frameQuantity: 10 });

    i = 0;

    this.tweens.add({
        targets: rect,
        x: 200,
        y: 200,
        width: 512,
        height: 100,
        delay: 2000,
        duration: 3000,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });
}

function update ()
{
    Phaser.Actions.PlaceOnRectangle(group.getChildren(), rect, i);

    i++;

    if (i === group.length)
    {
        i = 0;
    }
}
