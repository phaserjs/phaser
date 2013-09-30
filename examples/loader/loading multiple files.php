<?php
	$title = "Multi Touch";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

function loadStarted(size) {
	console.log('Loader started, queue size:', size);
}

//	this.progress, previousKey, success, this.queueSize - this._keys.length, this.queueSize
function fileLoaded(progress, key, success, remaining, total) {
	console.log('File Loaded:', key);
	console.log('Progress: ' + progress + '%');
	console.log('File: ' + remaining + ' out of ' + total);
}

function loadCompleted() {

	console.log('Loader finished');

	//	Let's try adding an image to the DOM
	document.body.appendChild(game.cache.getImage('cockpit'));

	//	And some text
	var para = document.createElement('pre');
	para.innerHTML = game.cache.getText('copyright');
	document.body.appendChild(para);

}

var game = new Phaser.Game(320, 240, Phaser.AUTO, '', {preload:preload});

function preload () {
	
game.load.image('cockpit', 'assets/pics/cockpit.png');
game.load.image('rememberMe', 'assets/pics/remember-me.jpg');
game.load.image('overdose', 'assets/pics/lance-overdose-loader_eye.png');
game.load.text('copyright', 'assets/warning - copyright.txt');

game.load.onLoadStart.add(loadStarted, this);
game.load.onFileComplete.add(fileLoaded, this);
game.load.onLoadComplete.add(loadCompleted, this);

}



})();

</script>



<?php
	require('../foot.php');
?>