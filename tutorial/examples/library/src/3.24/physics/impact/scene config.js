//  Here we'll define the physics settings in the Scene Config.
//  Note that settings defined in the Game Config are also used, but the Scene Config takes priority.
//  For example: the setting gravity has a value of 500 in the game config and 100 in the scene config.
//  The final gravity value will be 100, because the Scene value overrides the Game one.
//  Properties defined in the Game config that are missing in the Scene config are used.

//  A Scene can only ever have 1 active physics system, but the 'system' key must match the game config
//  in order for the two configs to merge properly

var sceneConfigMulti = {
    key: 'sceneA',
    preload: preload,
    create: create,
    physics: {
        arcade: {
            gravity: 500
        },
        impact: {
            gravity: 100,
            debugBodyColor: 0xffff00,
            setBounds: {
                x: 100,
                y: 100,
                width: 600,
                height: 300,
                thickness: 32
            }
        }
    }
};

var sceneConfig = {
    key: 'sceneA',
    preload: preload,
    create: create,
    physics: {
        system: 'impact',
        gravity: 100,
        debugBodyColor: 0xffff00,
        setBounds: {
            x: 100,
            y: 100,
            width: 600,
            height: 300,
            thickness: 32
        }
    }
};

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 500,
            debug: true,
            maxVelocity: 500,
            debugBodyColor: 0xff00ff
        }
    },
    scene: sceneConfig
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('gem', 'assets/sprites/gem.png');
}

function create ()
{
    this.impact.world.setBounds();

    this.impact.add.image(300, 300, 'gem').setActiveCollision().setVelocity(300, 200).setBounce(1);
}
