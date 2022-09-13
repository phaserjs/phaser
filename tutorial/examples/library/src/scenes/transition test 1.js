var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });

        this.face;
    },

    preload: function ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
    },

    create: function ()
    {
        this.face = this.add.image(0, 0, 'face').setOrigin(0);

        this.input.once('pointerdown', function () {

            this.scene.transition({
                target: 'sceneB',
                duration: 2000,
                moveBelow: true,
                onUpdate: this.transitionOut,
                data: { x: 400, y: 300 }
            });

        }, this);
    },

    transitionOut: function (progress)
    {
        this.face.y = (600 * progress);
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB' });
    },

    preload: function ()
    {
        this.load.image('arrow', 'assets/sprites/longarrow.png');
        this.load.image('planet', 'assets/tests/space/purple-planet.png');
    },

    create: function (data)
    {
        var planet = this.add.image(data.x, data.y, 'planet').setScale(0);

        this.events.on('transitionstart', function (fromScene, duration) {

            this.tweens.add({
                targets: planet,
                scaleX: 1,
                scaleY: 1,
                duration: duration
            });

        }, this);

        this.events.on('transitioncomplete', function () { console.log('Complete'); });

        this.events.on('transitionout', function (toScene, duration) {

            this.tweens.add({
                targets: planet,
                scaleX: 0,
                scaleY: 0,
                duration: duration
            });

        }, this);

        this.arrow = this.add.sprite(400, 300, 'arrow').setOrigin(0, 0.5);

        this.input.once('pointerdown', function (event) {

            this.scene.transition({
                target: 'sceneC',
                duration: 3000
            });

        }, this);
    },

    update: function (time, delta)
    {
        this.arrow.rotation += 0.01;
    }

});

var SceneC = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneC ()
    {
        Phaser.Scene.call(this, { key: 'sceneC' });
    },

    preload: function ()
    {
        this.load.image('mech', 'assets/pics/titan-mech.png');
    },

    create: function ()
    {
        this.add.sprite(Phaser.Math.Between(0, 800), 300, 'mech');

        this.input.once('pointerdown', function (event) {

            this.scene.start('sceneA');

        }, this);
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB, SceneC ]
};

var game = new Phaser.Game(config);
