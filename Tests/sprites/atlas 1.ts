/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        game.load.atlas('atlas', 'assets/sprites/invaderpig.png', 'assets/sprites/invaderpig.json');
        game.load.start();

    }

    var pig: Phaser.Sprite;
    var invader: Phaser.Sprite;

    function create() {

        game.stage.backgroundColor = 'rgb(40, 40, 40)';

        pig = game.add.sprite(200, 200, 'atlas', 'tennyson');
        invader = game.add.sprite(0, 0, 'atlas', 'invader1');

        console.log(pig.width, pig.height, pig.body.bounds.width, pig.body.bounds.height, pig.worldView);
        console.log(invader.width, invader.height, invader.body.bounds.width, invader.body.bounds.height, invader.worldView);

    }

})();
