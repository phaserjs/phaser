/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addImageFile('atari1', 'assets/sprites/atari130xe.png');
        myGame.loader.addImageFile('atari2', 'assets/sprites/atari800xl.png');
        myGame.loader.addImageFile('card', 'assets/sprites/mana_card.png');
        myGame.loader.load();
    }
    var items;
    var card;
    function create() {
        items = myGame.add.group();
        //  Items are rendered in the depth order in which they are added to the Group
        items.add(myGame.add.sprite(64, 100, 'atari1'));
        card = items.add(myGame.add.sprite(240, 80, 'card'));
        items.add(myGame.add.sprite(280, 100, 'atari2'));
        myGame.input.onTap.addOnce(removeCard, this);
    }
    function removeCard() {
        //  Now let's kill the card sprite
        card.kill();
        myGame.input.onTap.addOnce(replaceCard, this);
    }
    function replaceCard() {
        //  And bring it back to life again - I assume it will render in the same place as before?
        var bob = items.getFirstDead();
        bob.revive();
    }
    function update() {
    }
})();
