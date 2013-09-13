<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
	<script src="Preloader.js"></script>
	<script src="MainMenu.js"></script>
	<script src="Game.js"></script>
</head>
<body>

<script type="text/javascript">

(function () {

	//	No parameters given, which means no default state is created or started
    var game = new Phaser.Game(800, 600, Phaser.AUTO);

	game.state.add('preloader', TestGame.Preloader, true);
	game.state.add('mainmenu', TestGame.MainMenu);
	game.state.add('game', TestGame.Game);

})();

</script>

</body>
</html>