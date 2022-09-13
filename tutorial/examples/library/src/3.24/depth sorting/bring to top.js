var config = {
    type: Phaser.WEBGL,
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
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    //  Create a stack of blocks

    var group = this.make.group({ key: 'block', frameQuantity: 12 });

    Phaser.Actions.SetXY(group.getChildren(), 48, 500, 64, 0);

    this.input.on('pointerdown', function (pointer) {

        var child = this.children.getAt(0);

        child.y -= 32;

        this.children.bringToTop(child);

    }, this);

}
