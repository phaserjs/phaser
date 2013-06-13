/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/physics/advanced/Manager.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);

    function init() {

        game.load.image('atari', 'assets/sprites/atari800xl.png');
        game.load.image('card', 'assets/sprites/mana_card.png');
        game.load.start();

    }

    var atari: Phaser.Sprite;
    var card: Phaser.Sprite;

    function create() {

        atari = game.add.sprite(200, 310, 'atari');
        //card = game.add.sprite(500, 300, 'card');

        var body = new Phaser.Physics.Advanced.Body(atari, Phaser.Types.BODY_DYNAMIC);

        //body.

        console.log(body);

    }

    function update() {
    }

    function render() {
    }

})();
