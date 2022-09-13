class Controller extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'Controller', active: true });
    }

    create ()
    {
        this.input.on('pointerdown', function (pointer) {
            // this.scene.moveBelow('SceneA', 'SceneB');
            // this.scene.moveBelow('SceneB', 'SceneA');
            // this.scene.moveAbove('SceneB', 'SceneA');
            this.scene.moveAbove('SceneA', 'SceneB');
        }, this);
    }
}

class SceneA extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'SceneA', active: true });
    }

    create ()
    {
        this.add.rectangle(340, 300, 64, 64, 0xff33cc);
        this.add.text(340, 300, 'A');
    }
}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'SceneB', active: true });
    }

    create ()
    {
        this.add.rectangle(380, 300, 64, 64, 0xbbb3cc);
        this.add.text(380, 300, 'B');
    }
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Controller, SceneA, SceneB ]

    // When left mouse is clicked, SceneA and SceneB will be swapped regardless of the order
};

let game = new Phaser.Game(config);
