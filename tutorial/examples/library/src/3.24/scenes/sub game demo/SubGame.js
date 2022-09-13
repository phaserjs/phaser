var SubGame = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SubGame ()
    {
        Phaser.Scene.call(this, { key: 'subgame' });
    },

    create: function ()
    {
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'bg').setOrigin(0);

        this.add.image(400, 300, 'space', this.registry.get('planet')).setScale(0.5);

        this.add.text(10, 10, 'Click to return', { font: '16px Courier', fill: '#00ff00' });

        //  Click to quit this sub-"game"
        this.input.once('pointerdown', function () {

            //  We're done here, so stop this Scene and wake the world up
            this.scene.stop();
            this.scene.wake('world');

        }, this);
    }

});

