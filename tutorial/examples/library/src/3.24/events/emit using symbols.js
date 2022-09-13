const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);

function preload ()
{
    this.load.image('girl', 'assets/pics/manga-girl.png');
    this.load.image('plush', 'assets/pics/profil-sad-plush.png');
}

function create ()
{
    //  Our ES6 Symbols we'll use for both the handler and event emitter
    const plushSymbol = Symbol();
    const girlSymbol = Symbol();

    //  This handler will only be called once, no matter how many times the event fires
    this.events.once(plushSymbol, addPlushHandler, this);
    this.events.once(girlSymbol, addGirlHandler, this);

    this.events.emit(girlSymbol);
    this.events.emit(girlSymbol);
    this.events.emit(girlSymbol);

    this.events.emit(plushSymbol);
    this.events.emit(plushSymbol);
    this.events.emit(plushSymbol);
}

function addPlushHandler ()
{
    let x = Phaser.Math.Between(100, 700);
    let y = Phaser.Math.Between(0, 300);

    this.add.image(x, y, 'plush');
}

function addGirlHandler ()
{
    let x = Phaser.Math.Between(100, 700);
    let y = Phaser.Math.Between(300, 600);

    this.add.image(x, y, 'girl');
}
