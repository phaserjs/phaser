/// <reference path="phaser.d.ts" />

module BasicGame
{
	export class GameState extends Phaser.State {
		private _ball:Phaser.Sprite;
		private _paddle:Phaser.Sprite;
		private _bricks:Phaser.Group;

		private _ballOnPaddle:boolean;

		private _lives:number;
		private _score:number;

		private _scoreText:Phaser.Text;
		private _livesText:Phaser.Text;
		private _introText:Phaser.Text;

		private _s:Phaser.TileSprite;

		create():void {
			this.game.world.height = 620;

			this._ballOnPaddle = true;
			this._score = 0;
			this._lives = 3;

			this._s = this.game.add.tileSprite(0,0,800,600,"starfield");

			var brick:Phaser.Sprite;
			this._bricks = this.game.add.group();

			for( var y=0; y < 4; y++ )
			{
				for( var x=0; x < 15; x++)
				{
					brick = this._bricks.create(120 + ( x * 36 ), 100 + ( y * 52 ),"breakout","brick_" + ( y+1 ) + "_1.png");
					brick.body.bounce.setTo(1, 1);
					brick.body.immovable = true;
				}
			}

			this._paddle = this.game.add.sprite( this.game.world.centerX, 500, "breakout", "paddle_big.png");
			this._paddle.anchor.setTo(0.5,0.5);
			this._paddle.body.collideWorldBounds = true;
			this._paddle.body.bounce.setTo(1,1);
			this._paddle.body.immovable = true;

			this._ball = this.game.add.sprite( this.game.world.centerX, this._paddle.y - 16, "breakout",'ball_1.png');
			this._ball.anchor.setTo(0.5,0.5);
			this._ball.body.collideWorldBounds = true;

			this._ball.body.bounce.setTo(1,1);
			this._ball.animations.add("spin", ["ball_1.png", "ball_2.png", "ball_3.png", "ball_4.png", "ball_5.png" ], 50, true, false);

			this._scoreText = this.game.add.text(32, 550, "score: 0", {font: "20px Arial", fill: "#ffffff", align: "left" });
			this._livesText = this.game.add.text(680, 550, "lives: 3", {font: "20px Arial", fill: "#ffffff", align: "left" });
			this._introText = this.game.add.text(this.game.world.centerX, 400, "- click to start -", {font: "40px Arial", fill: "#ffffff", align: "center" });
			this._introText.anchor.setTo(0.5,0.5);

			this.game.input.onDown.add( this.releaseBall, this );

			this._ballOnPaddle = true;
			
		}

		update():void
		{
			this._paddle.x = this.game.input.x;

			if( this._paddle.x < 24 )
			{
				this._paddle.x = 24;
			}
			else if( this._paddle.x > this.game.width - 24 )
			{
				this._paddle.x = this.game.width - 24;
			}

			if( this._ballOnPaddle )
			{
				this._ball.x = this._paddle.x;
			}
			else
			{
				this.game.physics.collide( this._ball, this._paddle, this.ballHitPaddle, null, this );
				this.game.physics.collide( this._ball, this._bricks, this.ballHitBrick, null, this );
			}

			if( this._ball.y > 600 && this._ballOnPaddle == false )
			{
				this.ballLost();
			}
		}

		private quitGame( p_pointer?:any ):void
		{
			this.game.state.start("MainMenu");
		}

		private releaseBall():void
		{
			if( this._ballOnPaddle )
			{
				this._ballOnPaddle = false;
				this._ball.body.velocity.y = -300;
				this._ball.body.velocity.x = -75;
				this._ball.animations.play("spin");
				this._introText.visible = false;
			}
		}

		private ballLost():void
		{
			this._lives--;

			if( this._lives == 0)
			{
				this.gameOver();
			}
			else
			{
				this._livesText.content = "lives: " + this._lives;
				this._ballOnPaddle = true;
				this._ball.body.velocity.setTo(0,0);
				this._ball.x = this._paddle.x + 16;
				this._ball.y = this._paddle.y - 16;
				this._ball.animations.stop();
			}
		}

		private gameOver():void
		{
			this._ball.body.velocity.setTo(0,0);

			this.quitGame();
		}

		private ballHitBrick( p_ball:Phaser.Sprite, p_brick:Phaser.Sprite ):void
		{
			p_brick.kill();

			this._score += 10;
			this._scoreText.content = "score: " + this._score;

			if( this._bricks.countLiving() == 0 )
			{
				this._score += 1000;
				this._scoreText.content = "score: " + this._score;
				this._introText.content = "- Next Level -";

				this._ballOnPaddle = true;
				this._ball.body.velocity.setTo(0,0);
				this._ball.x = this._paddle.x + 16;
				this._ball.y = this._paddle.y - 16;
				this._ball.animations.stop();

				this._bricks.callAll('revive');
			}


		}

		private ballHitPaddle( p_ball:Phaser.Sprite, p_paddle:Phaser.Sprite ):void
		{
			var l_diff:number = 0;

			if( p_ball.x < p_paddle.x )
			{
				l_diff = p_paddle.x - p_ball.x;
				p_ball.body.velocity.x = (-10 * l_diff);
			}
			else if( p_ball.x > p_paddle.x )
			{
				l_diff = p_ball.x - p_paddle.x;
				p_ball.body.velocity.x = (10 * l_diff);
			}
			else
			{
				p_ball.body.velocity.x = 2 + Math.random() * 8;
			}
		}
	}
}