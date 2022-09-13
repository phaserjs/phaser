class ClownGameObject extends Phaser.GameObjects.Image {

    constructor (scene, x, y)
    {
        super(scene, x, y, 'clown');

        this.setScale(4);
    }

}

class ClownPlugin extends Phaser.Plugins.BasePlugin {

    constructor (pluginManager)
    {
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('clown', this.createClown);
    }

    createClown (x, y)
    {
        return this.displayList.add(new ClownGameObject(this.scene, x, y));
    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    pixelArt: true,
    plugins: {
        global: [
            { key: 'ClownPlugin', plugin: ClownPlugin, start: true }
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
    this.load.image('clown', 'assets/sprites/clown.png');
}

function create ()
{
    this.add.clown(400, 200);
    this.add.clown(300, 300);
    this.add.clown(500, 300);
}
