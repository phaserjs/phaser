/// <reference path="../../../Phaser/Game.ts" />
/// <reference path="../../../Phaser/State.ts" />
/// <reference path="FakeGame.ts" />

class MainMenu extends State {

    constructor(game: Game) {

        super(game);

    }

    private monster: Phaser.Sprite;
    private isFalling: bool = false;
    private hasClicked: bool = false;

    public init() {

        this.load.image('car', '../../assets/pics/supercars_parsec.png');
        this.loader.addSpriteSheet('monster', '../../assets/sprites/metalslug_monster39x40.png', 39, 40);

        this.load.start();

    }

    public create() {

		this.camera.backgroundColor = 'rgb(85,85,85)';

		this.add.sprite(80, 150, 'car');

        this.monster = this.game.add.sprite(80, 60, 'monster');

        this.monster.animations.add('walk');
        this.monster.animations.play('walk', 30, true);
        this.monster.velocity.x = 50;

    }

    public update() {

		if (this.monster.x >= 710 && this.isFalling == false)
		{
			this.isFalling = true;
			this.monster.velocity.x = 20;
			this.monster.acceleration.y = 200;
			this.monster.angularAcceleration = 100;
			this.monster.animations.stop('walk');
		}

        if (this.input.mouse.isDown && this.hasClicked == false)
        {
        	this.hasClicked = true;
            this.game.switchState(FakeGame);
        }

    }

    public render() {

		this.stage.context.fillStyle = 'rgb(0,0,0)';

		this.stage.context.font = 'bold 48px Arial';
		this.stage.context.textAlign = 'center';
		this.stage.context.fillText('Super Racer', this.stage.centerX, 60);

		this.stage.context.font = 'bold 22px Arial';
		this.stage.context.textAlign = 'center';
		this.stage.context.fillText('Click to "Play"', this.stage.centerX, 370);

    }

}
