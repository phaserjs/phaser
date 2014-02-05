var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

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
    items.create(64, 100, 'atari1');
    card = items.create(240, 80, 'card');
    items.create(280, 100, 'atari2');

    //  This event will be fired only once
    game.input.onTap.addOnce(removeCard, this);

}

function removeCard() {

    //  Now let's kill the card sprite
    card.kill();

    game.input.onTap.addOnce(replaceCard, this);

}

function replaceCard() {

    //  And bring it back to life again. It will render in the same place as before?
    var deadCard = items.getFirstDead();

    deadCard.revive();

}
