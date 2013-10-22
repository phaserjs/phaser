$(document).ready(function(){

	var dir = $.url().param('d');
	var file = $.url().param('f');
	var title = $.url().param('t');

	document.title = 'phaser - ' + title;

	$("#title").append(title);

	$.getScript(dir + "/" + file)

	.done(function(script, textStatus){

		// $.get(dir + "/" + file, function(data) {
		// 	console.log(typeof data);
		// 	console.log(data);
			// $("#sourcecode").text(data);
		// });

  	})

	.fail(function(jqxhr, settings, exception) {

		$("#title").text("Error");

		var node = '<p>Unable to load <u>' + dir + '/' + file + '</u></p>';

		$('#phaser-example').append(node);

	});

});
