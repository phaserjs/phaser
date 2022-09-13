var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var group;
var tween;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
}

function create ()
{
    var circle = new Phaser.Geom.Circle(400, 300, 220);

    group = this.add.group({ key: 'balls', frame: [0, 1, 5], repeat: 10 });

    Phaser.Actions.PlaceOnCircle(group.getChildren(), circle);

    tween = this.tweens.addCounter({
        from: 220,
        to: 100,
        duration: 3000,
        delay: 2000,
        ease: 'Sine.easeInOut',
        repeat: -1,
        yoyo: true
    });
}

function update ()
{
    Phaser.Actions.RotateAroundDistance(group.getChildren(), { x: 400, y: 300 }, 0.02, tween.getValue());
}
