var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });
    },

    preload: function ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
        this.load.image('arrow', 'assets/sprites/longarrow.png');
    },

    create: function ()
    {
        console.log('SceneA');

        this.scene.start('sceneB');
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB' });
    },

    create: function ()
    {
        console.log('SceneB');

        this.scene.start('sceneC');
    }

});

var SceneC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, { key: 'sceneC' });
    },

    create: function ()
    {
        console.log('SceneC');

        this.scene.start('sceneD');
    }

});

var SceneD = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneD ()
    {
        Phaser.Scene.call(this, { key: 'sceneD' });
    },

    create: function ()
    {
        console.log('SceneD');

        this.scene.start('sceneE');
    }

});

var SceneE = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneE ()
    {
        Phaser.Scene.call(this, { key: 'sceneE' });
    },

    create: function ()
    {
        console.log('SceneE');

        this.add.image(400, 300, 'face');
        this.arrow = this.add.sprite(400, 300, 'arrow').setOrigin(0, 0.5);
    },

    update: function (time, delta)
    {
        this.arrow.rotation += 0.01;
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ SceneA, SceneB, SceneC, SceneD, SceneE ]
};

var game = new Phaser.Game(config);
