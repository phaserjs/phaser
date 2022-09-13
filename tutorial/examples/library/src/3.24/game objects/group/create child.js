var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('phaser', 'assets/sprites/phaser2.png');
}

function create ()
{
    var group = this.add.group();

    //  Create a Sprite via the group.

    //  The Sprite is added to the Scene display list, and to the group, at the same time.

    group.create(400, 300, 'phaser');

    //  The above is a short-cut for:
    //  var sprite = this.add.sprite(400, 300, 'phaser');
    //  group.add(sprite);
}
