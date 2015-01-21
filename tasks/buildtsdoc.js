/**
* Add comments in a TypeScript definition file
*/
'use strict';
var ts = require('typescript-services');
var fs = require('fs');

var TypeScriptDocGenerator = (function () {
    function TypeScriptDocGenerator(tsDefFileName, jsdocJsonFileName) {
        this.pos = 0;
        this.nbCharsAdded = 0;
        this.jsonDocsFileName = jsdocJsonFileName;
        this.tsDefFileName = tsDefFileName;
        this.jsonDocsFileContent = fs.readFileSync(this.jsonDocsFileName, 'utf-8');
        this.docs = JSON.parse(this.jsonDocsFileContent);
        this.tsDefFileContent = fs.readFileSync(this.tsDefFileName, 'utf-8');
        this.tree = ts.Parser.parse('', ts.SimpleText.fromString(this.tsDefFileContent), true, new ts.ParseOptions(ts.LanguageVersion.EcmaScript5, true));
        this.sourceUnit = this.tree.sourceUnit();
        this.lineMap = this.tree.lineMap();
    }
    TypeScriptDocGenerator.prototype.cleanEndLine = function (str) {
        return str.replace(new RegExp('[' + "\r\n" + ']', 'g'), "\n").replace(new RegExp('[' + "\r" + ']', 'g'), "\n");
    };
    TypeScriptDocGenerator.prototype.completePrefix = function (oldPrefix, appendedPrefix) {
        if (oldPrefix === "") {
            return appendedPrefix;
        }
        else {
            return oldPrefix + "." + appendedPrefix;
        }
    };
    TypeScriptDocGenerator.prototype.repeatSpaces = function (nb) {
        var res = "";
        for (var i = 0; i < nb; i++) {
            res += " ";
        }
        return res;
    };
    TypeScriptDocGenerator.prototype.leadingWidth = function (nodeOrToken) {
        if (nodeOrToken != null) {
            for (var i = 0; i < nodeOrToken.childCount() ; i++) {
                var ltw = nodeOrToken.childAt(i).leadingTriviaWidth();
                if (ltw > 0) {
                    return ltw;
                }
            }
        }
        return 0;
    };
    TypeScriptDocGenerator.prototype.insertComment = function (commentLines, position) {
        if ((commentLines != null) && (commentLines.length > 0)) {
            var nbChars = 0;
            for (var i = 0; i < commentLines.length; i++) {
                nbChars += commentLines[i].trim().length;
            }
            if (nbChars > 0) {
                var lc = this.lineMap.getLineAndCharacterFromPosition(position);
                var nbSpaces = lc.character();
                var startLinePosition = this.lineMap.getLineStartPosition(lc.line());
                var comment = "\r\n" + this.repeatSpaces(nbSpaces) + "/**\r\n";
                for (var j = 0; j < commentLines.length; j++) {
                    comment += this.repeatSpaces(nbSpaces) + "* " + commentLines[j] + "\r\n";
                }
                comment += this.repeatSpaces(nbSpaces) + "*/\r\n";
                this.tsDefFileContent = this.tsDefFileContent.substr(0, startLinePosition + this.nbCharsAdded) + comment + this.tsDefFileContent.substr(startLinePosition + this.nbCharsAdded);
                this.nbCharsAdded += comment.length;
            }
        }
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
                        for (var k = 0; k < paramComments.length; k++)
                        {
                            if (k === 0)
                            {
                                comments.push("@param " + p.name + " " + paramComments[k].trim() + ((k === paramComments.length - 1) ? def : ""));
                            }
                            else
                            {
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
                            else
                            {
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
    TypeScriptDocGenerator.prototype.scanClass = function (c, fullName, classPos) {
        for (var i = 0; i < c.childCount() ; i++) {
            var elem = c.childAt(i);
            if (elem != null) {
                switch (elem.kind()) {
                    case ts.SyntaxKind.List:
                        classPos = this.scanClass(elem, fullName, classPos);
                        break;
                    case ts.SyntaxKind.ConstructorDeclaration:
                        this.insertComment(this.generateConstructorComments(fullName), classPos + this.leadingWidth(elem));
                        break;
                    case ts.SyntaxKind.MemberVariableDeclaration:
                        this.insertComment(this.generateMemberComments(fullName, elem.variableDeclarator.propertyName.fullText().trim()), classPos + this.leadingWidth(elem));
                        break;
                    case ts.SyntaxKind.MemberFunctionDeclaration:
                        this.insertComment(this.generateFunctionComments(fullName, elem.propertyName.fullText().trim()), classPos + this.leadingWidth(elem));
                        break;
                }
                if (elem.kind() !== ts.SyntaxKind.List) {
                    classPos += elem.fullWidth();
                }
            }
        }
        return classPos;
    };
    TypeScriptDocGenerator.prototype.scan = function (elem, prefix) {
        if (elem != null) {
            switch (elem.kind()) {
                case ts.SyntaxKind.List:
                    for (var k = 0; k < elem.childCount() ; k++) {
                        this.scan(elem.childAt(k), prefix);
                    }
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                    break;
                case ts.SyntaxKind.ClassDeclaration:
                    var fullClassName = this.completePrefix(prefix, elem.identifier.fullText().trim());
                    this.insertComment(this.generateClassComments(fullClassName), this.pos + this.leadingWidth(elem));
                    this.scanClass(elem, fullClassName, this.pos);
                    break;
                case ts.SyntaxKind.ModuleDeclaration:
                    for (var j = 0; j < elem.childCount() ; j++) {
                        this.scan(elem.childAt(j), this.completePrefix(prefix, elem.name.fullText().trim()));
                    }
                    break;
            }
            if ((elem.kind() !== ts.SyntaxKind.List) && (elem.kind() !== ts.SyntaxKind.ModuleDeclaration)) {
                this.pos += elem.fullWidth();
            }
        }
    };
    TypeScriptDocGenerator.prototype.getTsDefCommentedFileContent = function () {
        for (var i = 0; i < this.sourceUnit.childCount() ; i++) {
            this.scan(this.sourceUnit.childAt(i), "");
        }
        return this.tsDefFileContent;
    };
    return TypeScriptDocGenerator;
})();

module.exports = function (grunt) {
    grunt.registerMultiTask('buildtsdoc', 'Generate a TypeScript def with comments', function () {
        var tsdg = new TypeScriptDocGenerator(this.data.tsDefFileName, this.data.jsdocJsonFileName);
        fs.writeFileSync(this.data.dest, tsdg.getTsDefCommentedFileContent(), 'utf8');
    });
};
