$(document).ready(function () {

    var loc = window.location;
    var remote = (loc && loc.hostname && loc.hostname.indexOf('labs.phaser.io') !== -1);
    // var remote = true;

    var forceMode = getQueryString('force');
    var filename = getQueryString('src');
    var forcedVersion = getQueryString('v', false);
    var phaserVersion = getQueryString('v', (remote) ? versions[1].val : 'dev');
    var phaserVersionJS = phaserVersion + '.js';
    var currentPage = loc.pathname.substr(loc.pathname.lastIndexOf('/') + 1);

    if (filename.substr(-5) === '.json')
    {
        //  Prepare the links and Feedback form before we run the example
        var parts = filename.split('\\');
        parts.pop();
        parts.shift();
        backURL = parts.join('/') + '/';

        document.title = document.title.concat(' :: ' + filename);

        var phaserScript = document.createElement('script');

        phaserScript.type = 'text/javascript';
        phaserScript.async = true;

        //  Load the boot.json file

        $.getJSON(filename, function (json) {

            if (json.version && !forcedVersion)
            {
                phaserVersion = json.version;
                phaserVersionJS = phaserVersion + '.js';
            }

            //  Phaser Load Handler
            phaserScript.onload = function ()
            {
                $('#loading').hide();

                var idx = filename.lastIndexOf('/');

                if (idx === -1)
                {
                    idx = filename.lastIndexOf('\\');
                }

                var folder = filename.substr(0, idx + 1);

                if (json.module)
                {
                    //  Inject the example source
                    var mainModule = document.createElement('script');

                    mainModule.type = 'module';
                    mainModule.src = folder + '/main.js';

                    document.body.appendChild(mainModule);
                }
                else
                {
                    queue = json.files;

                    var loadScript = function ()
                    {
                        var src = queue.shift();

                        // console.log(folder, src);

                        //  Load the JS files defined in the json sequentially and in order

                        $.getScript(folder + src, function(data, textStatus, jqxhr) {

                            // console.log(textStatus); // Success
                            // console.log(jqxhr.status); // 200

                            if (queue.length)
                            {
                                loadScript();
                            }

                        });

                    };

                    loadScript();
                }
            }
        });

        phaserScript.src = './build/' + phaserVersionJS;

        /*
        if (remote && phaserVersion !== 'dev')
        {
            // <script src="//cdn.jsdelivr.net/npm/phaser@3.7.1/dist/phaser.min.js">
            phaserScript.src = '//cdn.jsdelivr.net/npm/phaser@' + phaserVersion + '/dist/phaser.min.js';
        }
        else
        {
            phaserScript.src = './build/' + phaserVersionJS;
        }
        */

        document.body.appendChild(phaserScript);
    }

});
