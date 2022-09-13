var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            maxVelocity: 500
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var iter = { x: 0, y: 0 };
var tilesprite;

var game = new Phaser.Game(config);

function preload()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
}

function create ()
{
    //  Calling this with no arguments will set the bounds to match the game config width/height
    this.impact.world.setBounds();

    //  Create a Tile Sprite object
    tilesprite = this.add.tileSprite(400, 300, 128, 128, 'mushroom');

    //  If you don't set the body as active it won't collide with the world bounds
    //  Set the Game Object we just created as being bound to this physics body
    var body = this.impact.add.body(200, 100).setGameObject(tilesprite).setActiveCollision().setVelocity(300, 150).setBounce(1);

    body.setCollideCallback(collide, this);
}

function collide (body, wall, axis)
{
    switch (wall.name)
    {
        case 'left':
            iter.x = -2;
            break;

        case 'right':
            iter.x = 2;
            break;

        case 'top':
            iter.y = -2;
            break;

        case 'bottom':
            iter.y = 2;
            break;
    }
}

function update ()
{
    tilesprite.tilePositionX += iter.x;
    tilesprite.tilePositionY += iter.y;
}
