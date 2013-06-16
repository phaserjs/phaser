/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update, render);
    function init() {
        //  Using Phasers asset loader we load up a PNG from the assets folder
        game.load.image('atari', 'assets/sprites/atari800xl.png');
        game.load.image('card', 'assets/sprites/mana_card.png');
        game.load.start();
    }
    var atari;
    var card;
    function create() {
        atari = game.add.sprite(200, 310, 'atari');
        card = game.add.sprite(500, 300, 'card');
        atari.input.start(0);
        atari.input.enableDrag();
        card.input.start(0);
        card.events.onInputDown.add(rotateIt, this);
    }
    function rotateIt() {
        card.rotation += 10;
    }
    function update() {
    }
    function render() {
        game.stage.context.save();
        game.stage.context.strokeStyle = 'rgb(255,255,0)';
        game.stage.context.strokeRect(atari.cameraView.x, atari.cameraView.y, atari.cameraView.width, atari.cameraView.height);
        game.stage.context.strokeStyle = 'rgb(255,0,255)';
        game.stage.context.strokeRect(card.cameraView.x, card.cameraView.y, card.cameraView.width, card.cameraView.height);
        game.stage.context.restore();
    }
})();
