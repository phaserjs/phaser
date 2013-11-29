$(document).ready(function(){

	$.getJSON("_site/examples.json")

	.done(function(data) {

		var i = 0;
		var t = 0;
		var len = 0;
		var node = '';
		var laser = '';

		var directories = Object.keys(data);

		directories.splice(directories.indexOf('basics'), 1);
		directories.splice(directories.indexOf('games'), 1);
		directories.sort();
		directories.unshift('basics', 'games');

		directories.forEach(function(dir)
		{
			var files = data[dir];
			len = Math.floor(files.length / 4) + 1;

			if ((files.length / 4) % 1 == 0)
			{
				len--;
			}

			if (len > 9)
			{
				laser = 'laser10';
			}
			else
			{
				laser = 'laser' + len;
			}

			if (i == 1)
			{
				node = '<div class="clear5"></div><div class="line dark-bg">';
			}
			else if (i == 2)
			{
				node = '<div class="clear5"></div><div class="line bright-bg">';
			}

			node += '<div class="box20"><p class="title strong">' + dir + '</p>';
			node += '<p class="count-examples strong">' + files.length + ' examples</p></div><div class="box80">';
			node += '<ul class="group-items ' + laser + '">';

			for (var e = 0; e < files.length; e++)
			{
				node += '<li><a href="_site/view_full.html?d=' + dir + '&amp;f=' + files[e].file + '&amp;t=' + files[e].title + '">' + files[e].title + '</a></li>';
	            t++;
			}

			node += '</ul></div>';

			$("#examples-list").append(node);

            i++;

            if (i == 3)
            {
                i = 1;
            }

		});

		$("#total").append(t);

	})

	.fail(function() {

		var node = '<div class="clear5"></div><div class="line dark-bg">';

		node += '<div class="box20"><p class="title strong">Error!</p>';
		node += '<p class="count-examples strong">:(</p></div><div class="box80"><div class="error">';

		node += '<p>Unable to load <u>examples.json</u> data file</p>';
		node += '<p>Did you open this html file locally?</p>';
		node += '<p>It needs to be opened via a web server, or due to browser security permissions<br />it will be unable to load local resources such as images and json data.</p>';
		node += '<p>Please see our <a href="#">Getting Started guide</a> for details.</p>';

		node += '</div>';
		node += '</div>';

		$("#examples-list").append(node);

	});

	$.getJSON("http://phaser.io/version.json")

	.done(function(data) {

		if (data.version !== '1.1.4')
		{
			$("#upgrade").append(data.version);
			$("#upgrade").css('display', 'inline-block');
		}

	});

});
