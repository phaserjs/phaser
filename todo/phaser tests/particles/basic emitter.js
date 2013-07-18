/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, null, create);
    var emitter;
    function create() {
        //  Creates a basic emitter, bursting out 50 default sprites (i.e. 16x16 white boxes)
        emitter = myGame.add.emitter(myGame.stage.centerX, myGame.stage.centerY);
        emitter.makeParticles(null, 50, false, 0);
        emitter.start(true);
    }
})();
