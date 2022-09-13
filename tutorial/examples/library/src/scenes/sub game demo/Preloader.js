var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Preloader ()
    {
        Phaser.Scene.call(this, { key: 'preloader' });
    },

    preload: function ()
    {
        this.load.image('bg', 'assets/tests/space/nebula.jpg');
        this.load.image('ship', 'assets/tests/space/ship.png');
        this.load.atlas('space', 'assets/tests/space/space.png', 'assets/tests/space/space.json');
    },

    create: function ()
    {
        this.scene.start('world');
    }

});
