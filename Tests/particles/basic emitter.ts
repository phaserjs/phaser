/// <reference path="../../Phaser/Phaser.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create);

    var emitter: Phaser.Emitter;

    function create() {

        //  Creates a basic emitter, bursting out 50 default sprites (i.e. 16x16 white boxes)
        emitter = myGame.createEmitter(myGame.stage.centerX, myGame.stage.centerY);
        emitter.makeParticles(null, 50, 0, false, 0);
        emitter.start(true);

    }

})();
