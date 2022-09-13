var fs = require('fs');
var path = require('path');

//  Toggles debug output.
var debug = true;

//  List of directories containing files which should be excluded from the index.
var excludedDirectories = [];

//  Files that were excluded due to being part of a bootable project
var excludedFiles = [];

//  The path to output the index file
var indexFile = 'public/documentIndex.json';

//  Exclude files and folders beginning with `_` or `archived`
var excludeDocuments = /(?:archived|_)/;

//  Includes files ending with `.json` or `.js`
var includeDocuments = /\.(?:js|json)$/;

//  It is bootable if the path ends in boot.json
var isBootableRegex = /boot\.json$/;

function getContainingDirectory (filePath)
{
    var parts = filePath.split(path.sep);

    //  Remove last segment of path
    parts.pop();

    //  Join the rest of the path
    return parts.join('/');
}

function isBootableProject (path)
{
    return isBootableRegex.test(path);
}

function pathIsExcluded (path)
{
    //  We do want to include the actual bootable json in the search, so we don't exclude it
    if (isBootableProject(path))
    {
        return false;
    }

    var containingDirectory = getContainingDirectory(path);

    if (excludedDirectories.includes(containingDirectory))
    {
        excludedFiles.push({ entry: path, reason: 'excluded directory: ' + containingDirectory });

        return true;
    }

    return false;
}

function excludeIfBootableProject (path)
{
    if (isBootableProject(path))
    {
        var directory = getContainingDirectory(path);

        excludedDirectories.push(directory);
    }
}

function getDocuments (tree, documents)
{
    var path = tree.path;

    if (includeDocuments.test(path))
    {
        if (excludeDocuments.test(path))
        {
            excludedFiles.push({ entry: path, reason: 'excluded path' });
        }
        else
        {
            documents.push(path);

            excludeIfBootableProject(path);
        }
    }
    else
    {
        // excludedFiles.push({ entry: path, reason: 'is folder' });
    }

    if (!tree.children)
    {
        return documents;
    }

    for (var i in tree.children)
    {
        documents = getDocuments(tree.children[i], documents);
    }

    return documents;
}

function wordMap (string)
{
    var map= {};
    var words = string.split(/[-\[\],:<>+*=;{}'().\s\d/\\]+/);

    words.forEach(function (word) {

        word = word.toLowerCase();

        if (!map.hasOwnProperty(word))
        {
            map[word] = 0;
        }

        map[word]++;

    });

    return map;
}

function indexDocument (documentPath)
{
    var path = documentPath;

    if (path.substr(0, 6) === 'public')
    {
        path = path.substr(11);
    }

    var title = path.replace(".json", "");
    var contents = fs.readFileSync(documentPath).toString();

    title = title.replace(".js", "");

    return { path: path, titleWords: wordMap(title), bodyWords: wordMap(contents) }
}

function debugOutput ()
{
    if (debug)
    {
        excludedFiles.forEach(function(file) {
            console.log("Excluded: " + file.entry  + ' - Reason: ' + file.reason);
        });

        // console.log(excludedDirectories);
    }
}

function index (filteredTree)
{
    var documents = getDocuments(filteredTree, []);

    var index = {};

    documents.forEach(function (path) {

        if (pathIsExcluded(path))
        {
            return;
        }

        var document = indexDocument(path);

        index[document.path] = document;

    });

    var indexCount = Object.keys(index).length;
    var excludeCount = excludedFiles.length;

    debugOutput();

    console.log("Indexed " + indexCount + " Files. Excluded " + excludeCount + " Files.");

    if (debug)
    {
        //  Use prettified version for dev and testing
        fs.writeFileSync(indexFile, JSON.stringify(index, null, 2))
    }
    else
    {
        //  Use minified version for production
        fs.writeFileSync(indexFile, JSON.stringify(index))
    }
}

module.exports = { index : index };
