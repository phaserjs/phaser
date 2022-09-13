class CustomSpineObject1
{
    constructor (scene, x, y, key, animationName, loop)
    {
        this.scene = scene;

        this.spine = scene.add.spine(x, y, key, animationName, loop);
    }
}

class CustomSpineObject2
{
    constructor (scene, x, y, key, animationName, loop)
    {
        this.scene = scene;

        this.spine = scene.make.spine({ scene, x, y, key, animationName, loop });

        scene.sys.displayList.add(this.spine);
        scene.sys.updateList.add(this.spine);
    }
}

class CustomSpineObject3
{
    constructor (scene, x, y, key, animationName, loop)
    {
        this.scene = scene;

        this.parent = scene.add.container(0, 0);

        this.spine = scene.make.spine({ scene, x, y, key, animationName, loop });

        this.parent.add(this.spine);
    }
}

class Example extends Phaser.Scene
{
    constructor ()
    {
        super({
            pack: {
                files: [
                    { type: 'scenePlugin', key: 'SpinePlugin', url: 'plugins/3.8/SpinePlugin.js', sceneKey: 'spine' }
                ]
            }
        });
    }

    preload ()
    {
        this.load.image('logo', 'assets/sprites/phaser.png');

        this.load.setPath('assets/spine/3.8/demos/');

        this.load.spine('set1', 'demos.json', [ 'atlas1.atlas' ], true);
    }

    create ()
    {
        this.add.image(0, 0, 'logo').setOrigin(0);

        let custom1 = new CustomSpineObject1(this, 100, 550, 'set1.spineboy', 'idle', true);
        let custom2 = new CustomSpineObject2(this, 350, 550, 'set1.spineboy', 'walk', true);
        let custom3 = new CustomSpineObject3(this, 600, 550, 'set1.spineboy', 'run', true);

        custom1.spine.setScale(0.5);
        custom2.spine.setScale(0.5);
        custom3.spine.setScale(0.5);
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    scene: Example
};

const game = new Phaser.Game(config);
