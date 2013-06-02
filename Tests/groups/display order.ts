/// <reference path="../../Phaser/Game.ts" />

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    function init() {

        game.loader.addImageFile('atari1', 'assets/sprites/atari130xe.png');
        game.loader.addImageFile('atari2', 'assets/sprites/atari800xl.png');
        game.loader.addImageFile('card', 'assets/sprites/mana_card.png');

        game.loader.load();

    }

    var items: Phaser.Group;
    var card: Phaser.Sprite;

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
