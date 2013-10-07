<?php
	$title = "Loading and caching a spritesheet";
	require('../head.php');
?>

<script type="text/javascript">



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
	document.body.appendChild(game.cache.getImage('mummy'));

	//	Dump the animation data out
	console.log(game.cache.getFrameData('mummy'));
}

var game = new Phaser.Game(320, 240, Phaser.AUTO, '', {preload:preload});

function preload () {
	
game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45);

game.load.onLoadStart.add(loadStarted, this);
game.load.onFileComplete.add(fileLoaded, this);
game.load.onLoadComplete.add(loadCompleted, this);

}





</script>



<?php
	require('../foot.php');
?>