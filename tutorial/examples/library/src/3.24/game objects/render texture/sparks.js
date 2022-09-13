var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var rt;
var rnd;
var player;

function preload() 
{
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
}

function create() 
{
    rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 });

    player = this.add.sprite(256, 256, 'dude').setOrigin(0.5, 0.5);

    rnd = Math.random;
}

function update()
{
    player.setPosition(this.input.x, this.input.y);

    draw();
}

function draw() 
{
    rt.clear();
    
    rt.alpha = rnd();
    rt.tint = (0xFFFFFF << rnd()*8092);

    for (i = 0; i < 5; i++)
    {
        var rot = Math.floor((rnd() * Math.PI * 2) + 1);
        var dist = 75 + Math.floor((rnd() * 50) + 1);
        var x = player.x + dist * Math.cos(rot);
        var y = player.y + dist * Math.sin(rot);
        
        rt.draw("dude", x, y);
    }
}
