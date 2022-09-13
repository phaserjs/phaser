$(document).ready(function () {

    var loc = window.location;
    var remote = (loc && loc.hostname && loc.hostname.indexOf('labs.phaser.io') !== -1);
    // var remote = true;

    var forceMode = getQueryString('force');
    var filename = getQueryString('src');
    var phaserVersion = getQueryString('v', (remote) ? versions[1].val : 'dev');
    var phaserVersionJS = phaserVersion + '.js';
    var currentPage = loc.pathname.substr(loc.pathname.lastIndexOf('/') + 1);

    if (filename.substr(-3) === '.js')
    {
        //  Prepare the links and Feedback form before we run the example
        var parts = filename.split('\\');
        parts.pop();
        parts.shift();
        backURL = parts.join('/') + '/';

        document.title = document.title.concat(' :: ' + filename);

        $('#editlink').attr('href', 'edit.html?src=' + filename);
        $('#iframelink').attr('href', 'iframe.html?src=' + filename);
        $('#csslink').attr('href', 'css.html?src=' + filename);
        $('#viewlink').attr('href', 'view.html?src=' + filename);
        $('#backlink').attr('href', 'index.html?dir=' + backURL);
        $('#mobilelink').attr('href', 'mobile.html?src=' + filename);

        if (remote)
        {
            $('#labslink').hide();
        }
        else
        {
            $('#labslink').on('click', function () {

                var labsURL = encodeURI('http://labs.phaser.io/view.html?src=' + filename);

                if (phaserVersion === 'dev')
                {
                    labsURL += '&v=dev';
                }

                $('#clippy').attr('value', labsURL);
                $('#clippy').focus();
                $('#clippy').select();
                var result = document.execCommand('copy');

            });
        }

        var versionlist = $('<select>').prop('id', 'changeversion').insertAfter('#csslink');

        versionlist.on('change', function () {

            document.location.href = currentPage + '?src=' + filename + '&v=' + this.value;

        });

        var selected = false;

        versions.forEach(function(item) {

            if (item.val === phaserVersion)
            {
                versionlist.append($("<option>").prop('value', item.val).prop('selected', true).text(item.text));
                selected = true;
            }
            else
            {
                versionlist.append($("<option>").prop('value', item.val).text(item.text));
            }

        });

        if (!selected)
        {
            versionlist.append($("<option>").prop('value', phaserVersion).prop('selected', true).text('Custom: ' + phaserVersion));
        }

        //  Load Phaser

        if (currentPage === 'iframe.html')
        {
            $('#phaserGame').attr('src', 'view-iframe.html?src=' + filename);
            $('#loading').hide();
            $('#nav').show();
        }
        else
        {
            if (forceMode === 'Canvas')
            {
                window.FORCE_CANVAS = true;
            }
            else if (forceMode === 'WebGL')
            {
                window.FORCE_WEBGL = true;
            }

            var phaserScript = document.createElement('script');

            phaserScript.type = 'text/javascript';
            phaserScript.async = true;

            phaserScript.onload = function ()
            {
                var jsPath = decodeURI(filename).split('\\').join('/');

                //  Load it and check if we need to be a module or not
                $.get(jsPath, '', function (srcFile) {

                    //  Inject the example source
                    var type = 'text/javascript';

                    if (srcFile.substr(0, 10) === '// #module')
                    {
                        type = 'module';
                    }

                    $('<script />').attr('id', 'examplesrc').attr('type', type).text(srcFile).appendTo(document.body);

                    $('#loading').hide();
                    $('#nav').show();

                    if (window.game)
                    {
                        var type = (game.config.renderType === 2) ? 'Canvas' : 'WebGL';

                        $('#forcemode').text('Force '  + type);
                        $('#forcemode').attr('href', 'view.html?force=' + type + '&v=' + phaserVersion + '&src=' + filename);
                    }
                    else
                    {
                        $('#forcemode').hide();
                    }

                }, 'text');

            };

            if (remote && phaserVersion !== 'dev' && selected)
            {
                // <script src="//cdn.jsdelivr.net/npm/phaser@3.7.1/dist/phaser.min.js">
                phaserScript.src = '//cdn.jsdelivr.net/npm/phaser@' + phaserVersion + '/dist/phaser.min.js';
            }
            else
            {
                phaserScript.src = './build/' + phaserVersionJS;
            }

            document.body.appendChild(phaserScript);
        }
    }

});
