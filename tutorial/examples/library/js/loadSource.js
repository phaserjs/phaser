function loadSource (file, callback)
{
    file = file.replace(/\\/g, '/');

    var xhr = new XMLHttpRequest();

    xhr.overrideMimeType('text/plain');
    xhr.open('GET', file, true);

    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599)
        {
            console.log(xhr);
            throw Error('Failed to load ' + file);
        }
        else
        {
            callback(xhr.responseText);
        }
    };

    xhr.send();
}
