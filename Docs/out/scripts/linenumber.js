(function() {
    var counter = 0;
    var numbered;
    var source = document.getElementsByClassName('prettyprint source');

    if (source && source[0]) {
        source = source[0].getElementsByTagName('code')[0];

        numbered = source.innerHTML.split('\n');
        numbered = numbered.map(function(item) {
            counter++;
            return '<span id="line' + counter + '"></span>' + item;
        });

        source.innerHTML = numbered.join('\n');
    }
})();
