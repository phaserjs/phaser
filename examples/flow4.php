<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
</head>
<body>

<script type="text/javascript">

var MegaGame = {};

MegaGame.MainMenu = function (game) {
	//	A reference to the local game will always be passed to your state when created
	//	You should store it somewhere handy for use in your functions, like this ...
	this.game = game;
};

MegaGame.MainMenu.prototype = {

	preload: function () {

		console.log('MainMenu.preload');
		this.game.load.image('bladerunner', 'assets/pics/acryl_bladerunner.png');

	},

	create: function () {

		console.log('MainMenu.create');
		document.body.appendChild(this.game.cache.getImage('bladerunner'));

	}

};

(function () {

	//	Finally in this example we pass in a custom State object which will be created upon boot
	var game = new Phaser.Game(800, 600, Phaser.RENDERER_AUTO, '', MegaGame.MainMenu);

})();

</script>

</body>
</html>