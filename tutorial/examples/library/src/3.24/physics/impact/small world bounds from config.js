var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 100,
            debug: true,
            setBounds: {
                x: 100,
                y: 100,
                width: 600,
                height: 300,
                thickness: 32
            },
            maxVelocity: 500
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('gem', 'assets/sprites/gem.png');
}

function create ()
{
    //  The world bounds have been set in the config.

    //  If you don't set the body as active it won't collide with the world bounds
    this.impact.add.image(300, 300, 'gem').setActiveCollision().setVelocity(300, 200).setBounce(1);

    //  It is your responsibility to ensure that new bodies are spawned within the world bounds.
}
