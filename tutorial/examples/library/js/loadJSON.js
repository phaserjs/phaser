function loadJSON (file, callback)
{
    var xhr = new XMLHttpRequest();

    xhr.overrideMimeType('application/json');
    xhr.open('GET', file, true);

    xhr.onload = function ()
    {
        if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599)
        {
            throw Error('Failed to load ' + file);
        }
        else
        {
            callback(JSON.parse(xhr.responseText));
        }
    };

    xhr.send();
}
