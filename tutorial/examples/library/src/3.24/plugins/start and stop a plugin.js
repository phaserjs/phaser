class MoveSpritePlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager);

        this.sprite;
    }

    init ()
    {
        console.log('init');
    }

    start ()
    {
        console.log('start');

        var eventEmitter = this.game.events;

        eventEmitter.on('step', this.update, this);
    }

    stop ()
    {
        console.log('stop');

        var eventEmitter = this.game.events;

        eventEmitter.off('step', this.update);
    }

    setSprite (sprite)
    {
        this.sprite = sprite;
    }

    update (time, delta)
    {
        if (this.sprite)
        {
            this.sprite.x -= 0.2 * delta;

            if (this.sprite.x < 0)
            {
                this.sprite.x = 800;
            }

        }
    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    plugins: {
        global: [
            { key: 'MoveSpritePlugin', plugin: MoveSpritePlugin, start: true }
        ]
    },
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);

function preload ()
{
    this.load.image('elephant', 'assets/sprites/elephant.png');
}

function create ()
{
    let ele = this.add.image(400, 300, 'elephant');

    let plugin = this.plugins.get('MoveSpritePlugin');

    plugin.setSprite(ele);

    this.input.on('pointerup', function (pointer) {

        if (this.plugins.isActive('MoveSpritePlugin'))
        {
            this.plugins.stop('MoveSpritePlugin');
        }
        else
        {
            this.plugins.start('MoveSpritePlugin');
        }

    }, this);
}
