var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var element;
var group;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.html('smalldiv', 'assets/text/smallDiv.html');
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    element = this.add.dom(400, 300).createFromCache('smalldiv');

    this.physics.add.existing(element, false);

    group = this.physics.add.group({
        key: 'ball',
        frameQuantity: 30,
        immovable: true
    });

    Phaser.Actions.PlaceOnRectangle(group.getChildren(), new Phaser.Geom.Rectangle(84, 84, 616, 416));

    element.body.setOffset(-(element.displayWidth / 2), -(element.displayHeight / 2));
    element.body.setVelocity(100, 200);
    element.body.setBounce(1, 1);
    element.body.setCollideWorldBounds(true);
}

function update ()
{
    this.physics.world.collide(element, group);
}
