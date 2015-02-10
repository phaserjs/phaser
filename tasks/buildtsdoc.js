/**
* Add comments in a TypeScript definition file
*/
'use strict';

var ts = require('typescript');
var fs = require('fs');

var TypeScriptDocGenerator = (function () {
    function TypeScriptDocGenerator(tsDefFileName, jsdocJsonFileName) {
        this.nbCharsAdded = 0;
        this.tsDefFileName = ts.normalizePath(tsDefFileName);
        this.tsDefFileContent = fs.readFileSync(this.tsDefFileName, 'utf-8').toString();
        this.delintNodeFunction = this.delintNode.bind(this);
        var jsonDocsFileContent = fs.readFileSync(jsdocJsonFileName, 'utf-8').toString();
        this.docs = JSON.parse(jsonDocsFileContent);
        var options = { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.AMD };
        var host = ts.createCompilerHost(options);
        var program = ts.createProgram([this.tsDefFileName], options, host);
        this.sourceFile = program.getSourceFile(this.tsDefFileName);
    }
    TypeScriptDocGenerator.prototype.getTsDefCommentedFileContent = function () {
        this.scan();
        return this.tsDefFileContent;
    };
    TypeScriptDocGenerator.prototype.repeatSpaces = function (nb) {
        var res = "";
        for (var i = 0; i < nb; i++) {
            res += " ";
        }
        return res;
    };
    TypeScriptDocGenerator.prototype.insertComment = function (commentLines, position) {
        if ((commentLines != null) && (commentLines.length > 0)) {
            var nbChars = 0;
            for (var i = 0; i < commentLines.length; i++) {
                nbChars += commentLines[i].trim().length;
            }
            if (nbChars > 0) {
                var lc = this.sourceFile.getLineAndCharacterFromPosition(position);
                var nbSpaces = lc.character - 1;
                var startLinePosition = this.sourceFile.getLineStarts()[lc.line - 1];
                var comment = "\r\n" + this.repeatSpaces(nbSpaces) + "/**\r\n";
                for (var j = 0; j < commentLines.length; j++) {
                    comment += this.repeatSpaces(nbSpaces) + "* " + commentLines[j].trimRight() + "\r\n";
                }
                comment += this.repeatSpaces(nbSpaces) + "*/\r\n";
                this.tsDefFileContent = this.tsDefFileContent.substr(0, startLinePosition + this.nbCharsAdded) + comment + this.tsDefFileContent.substr(startLinePosition + this.nbCharsAdded);
                this.nbCharsAdded += comment.length;
            }
        }
    };
    TypeScriptDocGenerator.prototype.cleanEndLine = function (str) {
        return str.replace(new RegExp('[' + "\r\n" + ']', 'g'), "\n").replace(new RegExp('[' + "\r" + ']', 'g'), "\n");
    };
    TypeScriptDocGenerator.prototype.findClass = function (className) {
        if (className.indexOf("p2.") === 0) {
            className = className.replace("p2.", "Phaser.Physics.P2.");
        }
        var elements = this.docs.classes.filter(function (element) {
            return (element.name === className);
        });
        return elements[0];
    };
    TypeScriptDocGenerator.prototype.generateClassComments = function (className) {
        var c = this.findClass(className);
        if (c != null) {
            var comments = [];
            comments = comments.concat(this.cleanEndLine(c.description).split("\n"));
            return comments;
        }
        else {
            return null;
        }
    };
    TypeScriptDocGenerator.prototype.generateMemberComments = function (className, memberName) {
        var c = this.findClass(className);
        if (c != null) {
            for (var i = 0; i < c.members.length; i++) {
                if (c.members[i].name === memberName) {
                    var m = c.members[i];
                    var comments = [];
                    comments = comments.concat(this.cleanEndLine(m.description).split("\n"));
                    if ((m.default != null) && (m.default !== "")) {
                        comments.push("Default: " + m.default);
                    }
                    return comments;
                }
            }
        }
        else {
            return null;
        }
    };
    TypeScriptDocGenerator.prototype.generateFunctionComments = function (className, functionName) {
        var c = this.findClass(className);
        if (c != null) {
            for (var i = 0; i < c.functions.length; i++) {
                if (c.functions[i].name === functionName) {
                    var f = c.functions[i];
                    var comments = [];
                    comments = comments.concat(this.cleanEndLine(f.description).split("\n"));
                    if (f.parameters.length > 0) {
                        comments.push("");
                    }
                    for (var j = 0; j < f.parameters.length; j++) {
                        var p = f.parameters[j];
                        if (p.type === "*") {
                            p.name = "args";
                        }
                        var def = "";
                        if ((p.default != null) && (p.default !== "")) {
                            def = " - Default: " + p.default;
                        }
                        var paramComments = this.cleanEndLine(p.description).split("\n");
                        for (var k = 0; k < paramComments.length; k++) {
                            if (k === 0) {
                                comments.push("@param " + p.name + " " + paramComments[k].trim() + ((k === paramComments.length - 1) ? def : ""));
                            }
                            else {
                                comments.push(this.repeatSpaces(("@param " + p.name + " ").length) + paramComments[k].trim() + ((k === paramComments.length - 1) ? def : ""));
                            }
                        }
                    }
                    if ((f.returns != null) && (f.returns.description.trim().length > 0)) {
                        var returnComments = this.cleanEndLine(f.returns.description).split("\n");
                        for (var l = 0; l < returnComments.length; l++) {
                            if (l === 0) {
                                comments.push("@return " + returnComments[l].trim());
                            }
                            else {
                                comments.push(this.repeatSpaces(("@return ").length) + returnComments[l].trim());
                            }
                        }
                    }
                    return comments;
                }
            }
        }
        else {
            return null;
        }
    };
    TypeScriptDocGenerator.prototype.generateConstructorComments = function (className) {
        var c = this.findClass(className);
        if (c != null) {
            var con = c.constructor;
            var comments = [];
            comments = comments.concat(this.cleanEndLine(con.description).split("\n"));
            if (con.parameters.length > 0) {
                comments.push("");
            }
            for (var j = 0; j < con.parameters.length; j++) {
                var p = con.parameters[j];
                if (p.type === "*") {
                    p.name = "args";
                }
                var def = "";
                if ((p.default != null) && (p.default !== "")) {
                    def = " - Default: " + p.default;
                }
                var paramComments = this.cleanEndLine(p.description).split("\n");
                for (var k = 0; k < paramComments.length; k++) {
                    if (k === 0) {
                        comments.push("@param " + p.name + " " + paramComments[k].trim() + ((k === paramComments.length - 1) ? def : ""));
                    }
                    else {
                        comments.push(this.repeatSpaces(("@param " + p.name + " ").length) + paramComments[k].trim() + ((k === paramComments.length - 1) ? def : ""));
                    }
                }
            }
            return comments;
        }
        else {
            return null;
        }
    };
    TypeScriptDocGenerator.prototype.scan = function () {
        this.delintNode(this.sourceFile);
    };
    TypeScriptDocGenerator.prototype.getClassName = function (node) {
        var fullName = '';
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            fullName = node.name.getText();
        }
        var parent = node.parent;
        while (parent != null) {
            if (parent.kind === ts.SyntaxKind.ModuleDeclaration || parent.kind === ts.SyntaxKind.ClassDeclaration) {
                fullName = parent.name.getText() + ((fullName !== '') ? "." + fullName : fullName);
            }
            parent = parent.parent;
        }
        return fullName;
    };
    TypeScriptDocGenerator.prototype.delintNode = function (node) {
        switch (node.kind) {
            case ts.SyntaxKind.Constructor:
                this.insertComment(this.generateConstructorComments(this.getClassName(node)), node.getStart());
                break;
            case ts.SyntaxKind.ClassDeclaration:
                this.insertComment(this.generateClassComments(this.getClassName(node)), node.getStart());
                break;
            case ts.SyntaxKind.Property:
                this.insertComment(this.generateMemberComments(this.getClassName(node), node.name.getText()), node.getStart());
                break;
            case ts.SyntaxKind.Method:
                this.insertComment(this.generateFunctionComments(this.getClassName(node), node.name.getText()), node.getStart());
                break;
        }
        ts.forEachChild(node, this.delintNodeFunction);
    };
    return TypeScriptDocGenerator;
})();
module.exports = function (grunt) {
    grunt.registerMultiTask('buildtsdoc', 'Generate a TypeScript def with comments', function () {
        var tsdg = new TypeScriptDocGenerator(this.data.tsDefFileName, this.data.jsdocJsonFileName);
        fs.writeFileSync(this.data.dest, tsdg.getTsDefCommentedFileContent(), 'utf8');
    });
};