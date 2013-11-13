/// <reference path="phaser.d.ts" />

module BasicGame
{
	export class MainMenu extends Phaser.State
	{
		music:Phaser.Sound;
		playButton:Phaser.Button;

		create():void {
			
			this.music = this.add.audio("titleMusic",1,false);
			this.music.play("titleMusic",0);

			this.add.sprite(0,0,"titlepage");

			this.playButton = this.add.button(200,300,"playButton", this.startGame, 1, 1, 1);
		}

		startGame():void {
			this.music.stop();
			alert("START THE GAME!");
		}
	}
}