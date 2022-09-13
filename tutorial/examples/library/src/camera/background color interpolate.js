class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () 
    {
        this.load.image('star', 'assets/demoscene/star2.png');
        this.load.image('dude', 'assets/sprites/phaser-dude.png');
    }

    create () 
    {
        this.w = this.cameras.main.width;
        this.h = this.cameras.main.height;
    
        var bg = this.add.group({ key: 'star', frameQuantity: 300 });
    
        this.sky = new Phaser.Display.Color(120, 120, 255);
        this.space = new Phaser.Display.Color(0, 0, 0);
    
        this.player = this.add.sprite(this.w / 2, 0, 'dude');
    
        this.cameras.main.startFollow(this.player);
    
        var rect = new Phaser.Geom.Rectangle(0, -2 * this.h, this.w, 2 * this.h);
    
        Phaser.Actions.RandomRectangle(bg.getChildren(), rect);
    }

    update () 
    {
        this.player.y = (Math.cos(this.time.now / 1000) * (this.h - 10)) - this.h;

        var hexColor = Phaser.Display.Color.Interpolate.ColorWithColor(this.sky, this.space, -this.h * 2, this.player.y);
    
        this.cameras.main.setBackgroundColor(hexColor);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
