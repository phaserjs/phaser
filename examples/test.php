<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
</head>
<body>

<script type="text/javascript">

var BigGame = function(context) {

	console.log(context);
	console.log(context['hello']);
	// this.pendingCallback = callback;
	this.pendingCallback = context['hello'];

	var _this = this;

    this._onLoop = function () {
        return _this.boot();
    }

	if (document.readyState === 'complete' || document.readyState === 'interactive')
	{
		window.setTimeout(this._onLoop, 0);
	}
	else
	{
		document.addEventListener('DOMContentLoaded', this._onLoop, false);
		window.addEventListener('load', this._onLoop, false);
	}

};

BigGame.prototype = {

	isBooted: false,
	pendingCallback: null,
	_onLoop: null,

	boot: function () {

		if (this.isBooted) {
			return;
		}
		else
		{
			document.removeEventListener('DOMContentLoaded', this._onLoop);
			window.removeEventListener('load', this._onLoop);

			this.pendingCallback();
		}

	},

	check: function () {
		console.log(Math.random());
	}

};

(function () {

	//	because this is in a closure we have to pass a reference to the function directly, it can't guess it
	// var bob = new BigGame(hello);
	//var bob = new BigGame(this);

	function hello() {
	  console.log('hello world 2');
	  console.log(bob);
	  bob.check();
	}

})();

</script>

</body>
</html>