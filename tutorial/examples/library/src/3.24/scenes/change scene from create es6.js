class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('sceneA');
    }

    preload ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    }

    create ()
    {
        this.scene.start('sceneB');
    }

}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('sceneB');
    }

    create ()
    {
        this.scene.start('sceneC');
    }

}

class SceneC extends Phaser.Scene {

    constructor ()
    {
        super('sceneC');
    }

    create ()
    {
        this.scene.start('sceneD');
    }

}

class SceneD extends Phaser.Scene {

    constructor ()
    {
        super('sceneD');
    }

    create ()
    {
        this.face = this.add.image(400, 300, 'face');
        this.arrow = this.add.sprite(400, 300, 'arrow').setOrigin(0, 0.5);
    }

    update ()
    {
        this.arrow.rotation += 0.01;
    }

}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ SceneA, SceneB, SceneC, SceneD ]
};

var game = new Phaser.Game(config);
