var Cannon = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Cannon ()
    {
        Phaser.Scene.call(this, { key: 'cannon' });

        this.graphics;
        this.bob;
        this.bob2;
    },

    preload: function ()
    {
        this.load.obj('invader', 'assets/text/invader.obj');
    },

    create: function ()
    {
        this.graphics = this.add.graphics();

        this.bob = this.graphics.createMesh('invader', 0, 5, -10);

        this.bob2 = this.graphics.createMesh('invader', 5, 5, -10);
        this.bob2.setStrokeColor(0xff0000);

        this.graphics.setViewport(800, 600);
        this.graphics.setCameraPosition(0, 6, -32);
        this.graphics.setCameraTarget(0, 0, 50);
    },

    update: function (time, delta)
    {
        this.bob.rotation.z += 0.01;
        this.bob2.rotation.z -= 0.01;

        this.graphics.clear();

        this.graphics.strokeMesh(this.bob);
        this.graphics.strokeMesh(this.bob2);
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Cannon ]
};

var game = new Phaser.Game(config);
