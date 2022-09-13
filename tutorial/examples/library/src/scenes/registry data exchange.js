var SceneA = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneA ()
    {
        Phaser.Scene.call(this, { key: 'sceneA' });

        this.score = 0;
    },

    create: function ()
    {
        //  Store the score in the Registry
        this.registry.set('score', this.score);

        //  Update the score every 500ms
        this.time.addEvent({ delay: 500, callback: this.onEvent, callbackScope: this, loop: true });
    },

    onEvent: function ()
    {
        this.score++;

        this.registry.set('score', this.score);
    }

});

var SceneB = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function SceneB ()
    {
        Phaser.Scene.call(this, { key: 'sceneB', active: true });

        this.text;
    },

    create: function ()
    {
        this.text = this.add.text(100, 100, 'Monitoring Registry');

        //  Check the Registry and hit our callback every time the 'score' value is updated
        this.registry.events.on('changedata', this.updateScore, this);
    },

    updateScore: function (parent, key, data)
    {
        this.text.setText('Score: ' + data);
    }

});

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB ]
};

var game = new Phaser.Game(config);
