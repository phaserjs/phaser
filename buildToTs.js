//get type helper
const fs = require('fs');
const path = require('path');


// copies all files from * to *
const copyRecursiveSync = function (src, dest) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && stats.isDirectory();
    if (exists && isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.linkSync(src, dest);
    }
};


// delets all files in folder *
const deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};


//renames all files in folder * from .js to *ts
const renameDir = function (dir) {
    var files = fs.readdirSync(dir),
        f,
        fileName,
        path,
        newPath,
        file;

    for (f = 0; f < files.length; f += 1) {
        fileName = files[f];
        path = dir + '/' + fileName;
        file = fs.statSync(path);
        newPath = dir + '/' + fileName.replace(".js", ".ts");
        fs.renameSync(path, newPath);
        if (file.isDirectory()) {
            renameDir(newPath);
        }
    }
}

// remove srcTS
deleteFolderRecursive('srcTS')

// copy src to srcTS
copyRecursiveSync('src', 'srcTS');

// rename files in folder from js to ts
renameDir('srcTS');



// user fusebox-typechecker to tslint and typecheck srcTS folder
// will emit js & d.ts filers under distTS folder
var Transpile = require('fuse-box-typechecker').TypeHelper

// configure
var transpile = Transpile({
    tsConfig: './tsconfig.json',
    basePath: './',
    tsLint: './tslint.json',
    name: 'build',
    shortenFilenames: true,
    yellowOnLint: true,
    emit: true,
    clearOnEmit: true,
    // skip there errors, fusebox typechker is strict, does not emit files if ANY error!
    skipTsErrors: [2403, 2554, 2339, 2300, 2393, 2304, 2552, 2540, 2551, 2322, 2356, 2362, 2348, 2350, 2351]
});

// start watch, will only emit when there is no errors
transpile.runSync();

