/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, preload, create);

    function preload() {
        game.load.image('atari1', 'assets/sprites/atari130xe.png');
        game.load.image('atari2', 'assets/sprites/atari800xl.png');
        game.load.image('card', 'assets/sprites/mana_card.png');
    }

    var items;
    var card;

    function create() {
        items = game.add.group();

        //  Items are rendered in the depth order in which they are added to the Group
        items.addNewSprite(64, 100, 'atari1');
        card = items.addNewSprite(240, 80, 'card');
        items.addNewSprite(280, 100, 'atari2');

        game.input.onTap.addOnce(removeCard, this);
    }

    function removeCard() {
        //  Now let's kill the card sprite
        card.kill();

        game.input.onTap.addOnce(replaceCard, this);
    }

    function replaceCard() {
        //  And bring it back to life again - I assume it will render in the same place as before?
        var bob = items.getFirstDead();

        bob.revive();
    }
})();
