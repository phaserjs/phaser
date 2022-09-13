var Controller = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Controller ()
    {
        Phaser.Scene.call(this, { key: 'controller' });
    },

    preload: function ()
    {
        this.load.script('demo', 'src/scenes/external scene/Demo.js');
    },

    create: function ()
    {
        var clone = 0;

        this.time.addEvent({ delay: 2000, callback: function () {

            this.scene.add('demo' + clone, Demo, true);
            clone++;

        }, callbackScope: this, repeat: 2 });
    }

});

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Controller ]
};

var game = new Phaser.Game(config);
