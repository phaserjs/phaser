/// <reference path="phaser.d.ts" />
module BasicGame
{
	export class Boot extends Phaser.State{
		preload() {
			this.load.image("preloaderBackground","assets/preloader_background.gif");
			this.load.image("preloaderBar","assets/preloadr_bar.png");
		}
		create() {
			this.game.input.maxPointers = 1;
			this.game.stage.disableVisibilityChange = true;

			if( this.game.device.desktop )
			{
				this.game.stage.scale.pageAlignHorizontally = true;
			}
			else
			{
				this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
				this.game.stage.scale.minWidth = 480;
				this.game.stage.scale.minHeight = 260;
				this.game.stage.scale.maxWidth = 1024;
				this.game.stage.scale.maxHeight = 768;
				this.game.stage.scale.forceLandscape = true;
				this.game.stage.scale.pageAlignHorizontally = true;
				this.game.stage.scale.setScreenSize( true );
			}

			this.game.state.start("Preloader");
		}
	}
}