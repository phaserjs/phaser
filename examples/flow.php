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

//	Your game will work either from within a closure or not, it doesn't matter
(function () {

	//	These are all optional parameters now
	var game = new Phaser.Game();

	//	In this approach we're simply using functions in the current scope to do what we need
	game.launch(this, preload, create);

	function preload() {

		console.log('*** preload called');

		game.load.image('cockpit', 'assets/pics/cockpit.png');
		game.load.image('rememberMe', 'assets/pics/remember-me.jpg');
		game.load.image('overdose', 'assets/pics/lance-overdose-loader_eye.png');
		game.load.text('copyright', 'assets/warning - copyright.txt');

	}

	function create() {

		console.log('*** create called');

		//	Let's try adding an image to the DOM
		document.body.appendChild(game.cache.getImage('cockpit'));
		document.body.appendChild(game.cache.getImage('overdose'));

		//	And some text
		var para = document.createElement('pre');
		para.innerHTML = game.cache.getText('copyright');
		document.body.appendChild(para);

	}

/})();

</script>

</body>
</html>