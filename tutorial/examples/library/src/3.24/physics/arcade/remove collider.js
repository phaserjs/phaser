var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {debug: true}
    },
    scene: {
        preload: preload,
        create: create
    }
};

var sprite;
var group;

new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    sprite = this.physics.add.image(400, 300, 'mushroom');

    group = this.physics.add.staticGroup({
        key: 'ball',
        frameQuantity: 30
    });

    Phaser.Actions.PlaceOnRectangle(group.getChildren(), new Phaser.Geom.Rectangle(84, 84, 616, 416));

    //  We need to call this because placeOnRectangle has changed the coordinates of all the children
    //  If we don't call it, the static physics bodies won't be updated to reflect them
    group.refresh();

    sprite.setVelocity(100, 200).setBounce(1, 1).setCollideWorldBounds(true).setGravityY(200);

    var collider = this.physics.add.collider(sprite, group, null, function ()
    {
        this.physics.world.removeCollider(collider);
    }, this);

}
