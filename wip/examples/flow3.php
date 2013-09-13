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

(function () {

	var state = {

		preload: function() {

			console.log('state preload called');
			game.load.image('rememberMe', 'assets/pics/remember-me.jpg');
			game.load.text('copyright', 'assets/warning - copyright.txt');

		},

		create: function() {

			console.log('state create called');

			//	Let's try adding an image to the DOM
			document.body.appendChild(game.cache.getImage('rememberMe'));

			//	And some text
			var para = document.createElement('pre');
			para.innerHTML = game.cache.getText('copyright');
			document.body.appendChild(para);

		}
	}

	//	In this example we're passing in a custom state object, not an instance of Phaser.State
	var game = new Phaser.Game(800, 600, Phaser.RENDERER_AUTO, '', state);

})();

</script>

</body>
</html>