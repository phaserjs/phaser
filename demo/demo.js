var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '',{preload: preload, create: create, update:update});

var rope;

function preload() {
    console.log('preload');
    game.load.image('snake', 'assets/snake.png');
}

function create() {
    console.log('create');
    rope = game.add.rope(0,this.game.world.centerY,'snake');
}

function update() {

}
