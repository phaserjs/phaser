class Example extends Phaser.Scene {

    constructor ()
    {
        super();
    }

    preload ()
    {
        //  It's essential that the key given here is the exact class name used in the JS file. It's case-sensitive.
        //  See the SceneB.js file and documentation for details.
        this.load.sceneFile('ExternalScene', 'assets/loader-tests/ExternalScene.js');
    }

    create ()
    {
        this.scene.start('myScene');
    }

}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000',
    scene: Example
};

const game = new Phaser.Game(config);
