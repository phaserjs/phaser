/**
* Add comments in a TypeScript definition file
*/
'use strict';

var ts = require('typescript');
var fs = require('fs');
var _grunt = null;

var TypeScriptDocGenerator = (function () {

    function TypeScriptDocGenerator(tsDefFileName, jsdocJsonFileName) {

        _grunt.log.writeln("TS Defs: " + tsDefFileName + " json: " + jsdocJsonFileName);

        this.nbCharsAdded = 0;
        this.tsDefFileName = ts.normalizePath(tsDefFileName);
        this.tsDefFileContent = fs.readFileSync(this.tsDefFileName, 'utf-8').toString();
        this.delintNodeFunction = this.delintNode.bind(this);

        var jsonDocsFileContent = fs.readFileSync(jsdocJsonFileName, 'utf-8').toString();

        this.docs = JSON.parse(jsonDocsFileContent);

        _grunt.log.writeln("json parsed");

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

        for (var i = 0; i < nb; i++)
        {
            res += " ";
        }

        return res;

    };

    TypeScriptDocGenerator.prototype.insertComment = function (commentLines, position) {

        if ((commentLines != null) && (commentLines.length > 0))
        {
            var nbChars = 0;

            for (var i = 0; i < commentLines.length; i++)
            {
                nbChars += commentLines[i].trim().length;
            }

            if (nbChars > 0)
            {
                var lc = this.sourceFile.getLineAndCharacterFromPosition(position);
                var nbSpaces = lc.character - 1;
                var startLinePosition = this.sourceFile.getLineStarts()[lc.line - 1];
                var comment = "\r\n" + this.repeatSpaces(nbSpaces) + "/**\r\n";

                for (var j = 0; j < commentLines.length; j++)
                {
                    comment += this.repeatSpaces(nbSpaces) + "* " + commentLines[j].trimRight() + "\r\n";
                }

                comment += this.repeatSpaces(nbSpaces) + "*/\r\n";

                this.tsDefFileContent = this.tsDefFileContent.substr(0, startLinePosition + this.nbCharsAdded) + comment + this.tsDefFileContent.substr(startLinePosition + this.nbCharsAdded);
                this.nbCharsAdded += comment.length;

                // _grunt.log.writeln("comment: " + comment);
            }
        }

    };

    TypeScriptDocGenerator.prototype.cleanEndLine = function (str) {

        return str.replace(new RegExp('[' + "\r\n" + ']', 'g'), "\n").replace(new RegExp('[' + "\r" + ']', 'g'), "\n");

    };

    TypeScriptDocGenerator.prototype.findClass = function (className) {

        // _grunt.log.writeln("findClass: " + className);

        if (className.indexOf("p2.") === 0)
        {
            className = className.replace("p2.", "Phaser.Physics.P2.");
        }

        var elements = this.docs.classes.filter(function (element) {
            return (element.name === className);
        });

        return elements[0];

    };

    TypeScriptDocGenerator.prototype.generateClassComments = function (className) {

        // _grunt.log.writeln("generateClassComments: " + className);

        var c = this.findClass(className);

        // _grunt.log.writeln("generateClassComments class found: " + JSON.stringify(c));

        if (c !== null && c !== undefined)
        {
            var comments = [];
            comments = comments.concat(this.cleanEndLine(c.description).split("\n"));
            // _grunt.log.writeln("generateClassComments return comments");
            return comments;
        }
        else
        {
            // _grunt.log.writeln("generateClassComments return null");
            return null;
        }

    };

    TypeScriptDocGenerator.prototype.generateMemberComments = function (className, memberName) {

        _grunt.log.writeln("generateMemberComments: " + className + " = " + memberName);

        var c = this.findClass(className);

        if (c !== null)
        {
            for (var i = 0; i < c.members.length; i++)
            {
                if (c.members[i].name === memberName)
                {
                    var m = c.members[i];
                    var comments = [];
                    comments = comments.concat(this.cleanEndLine(m.description).split("\n"));

                    if ((m.default != null) && (m.default !== ""))
                    {
                        comments.push("Default: " + m.default);
                    }

                    return comments;
                }
            }
        }
        else
        {
            return null;
        }

    };

    TypeScriptDocGenerator.prototype.generateFunctionComments = function (className, functionName) {

        _grunt.log.writeln("generateFunctionComments: " + className);

        var c = this.findClass(className);

        if (c !== null)
        {
            for (var i = 0; i < c.functions.length; i++)
            {
                if (c.functions[i].name === functionName)
                {
                    var f = c.functions[i];
                    var comments = [];
                    comments = comments.concat(this.cleanEndLine(f.description).split("\n"));

                    if (f.parameters.length > 0)
                    {
                        comments.push("");
                    }

                    for (var j = 0; j < f.parameters.length; j++)
                    {
                        var p = f.parameters[j];

                        if (p.type === "*")
                        {
                            p.name = "args";
                        }

                        var def = "";

                        if ((p.default != null) && (p.default !== ""))
                        {
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

                    if ((f.returns != null) && (f.returns.description.trim().length > 0))
                    {
                        var returnComments = this.cleanEndLine(f.returns.description).split("\n");

                        for (var l = 0; l < returnComments.length; l++)
                        {
                            if (l === 0)
                            {
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
        else
        {
            return null;
        }

    };

    TypeScriptDocGenerator.prototype.generateConstructorComments = function (className) {

        _grunt.log.writeln("generateConstructorComments: " + className);

        var c = this.findClass(className);

        if (c !== null)
        {
            // _grunt.log.writeln("Class: " + c);

            var con = c.constructor;
            var comments = [];

            comments = comments.concat(this.cleanEndLine(con.description).split("\n"));

            if (con.parameters.length > 0)
            {
                comments.push("");
            }

            for (var j = 0; j < con.parameters.length; j++)
            {
                var p = con.parameters[j];

                if (p.type === "*")
                {
                    p.name = "args";
                }

                var def = "";

                if ((p.default != null) && (p.default !== ""))
                {
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

            return comments;

        }
        else
        {
            return null;
        }

    };

    TypeScriptDocGenerator.prototype.scan = function () {

        this.delintNode(this.sourceFile);

    };

    TypeScriptDocGenerator.prototype.getClassName = function (node) {

        // _grunt.log.writeln("getClassName: " + JSON.stringify(node));
        // _grunt.log.writeln("getClassName: " + JSON.stringify(node.kind));
        // _grunt.log.writeln("getClassName: " + JSON.stringify(node.name));

        var fullName = '';

        if (node.name !== undefined && node.kind === ts.SyntaxKind.ClassDeclaration)
        {
            // _grunt.log.writeln("getClassName 1a: " + node.name.text);

            try {
                fullName = node.name.getText();
                // _grunt.log.writeln("getClassName 1b: " + fullName);
            }
            catch (e)
            {
                fullName = node.name.text;
                // _grunt.log.writeln("getClassName bail");
                // return '';
            }
        }

        var parent = node.parent;

        while (parent !== null && parent !== undefined)
        {
            // _grunt.log.writeln("getClassName 2");

            if (parent.kind === ts.SyntaxKind.ModuleDeclaration || parent.kind === ts.SyntaxKind.ClassDeclaration)
            {
                fullName = parent.name.getText() + ((fullName !== '') ? "." + fullName : fullName);
            }

            parent = parent.parent;
        }

        if (fullName === undefined || fullName === null)
        {
            fullName = '';
        }

        // _grunt.log.writeln("getClassName: " + fullName);

        return fullName;

    };

    TypeScriptDocGenerator.prototype.delintNode = function (node) {

        var c = this.getClassName(node);

        var r = true;

        try {
            r = node.getStart();
        }
        catch (e)
        {
            r = false;
        }

        switch (node.kind)
        {
            case ts.SyntaxKind.Constructor:
                // _grunt.log.writeln("insert1: " + node);

                if (c !== '' && r)
                {
                    this.insertComment(this.generateConstructorComments(c, r));
                }

                break;

            case ts.SyntaxKind.ClassDeclaration:
                // _grunt.log.writeln("insertX2: " + JSON.stringify(node));
                // _grunt.log.writeln("insertX2a: " + JSON.stringify(node.name));
                // _grunt.log.writeln("insertX2b: " + this.getClassName(node));
                // _grunt.log.writeln("insertX2c: " + r);
                // _grunt.log.writeln("insertX2d ...");

                if (c !== '' && r)
                {
                    this.insertComment(this.generateClassComments(c, r));
                }

                break;

            case ts.SyntaxKind.Property:
                // _grunt.log.writeln("insert3: " + node);

                var t = true;

                try {
                    t = node.name.getText();
                }
                catch (e)
                {
                    t = false;
                }

                if (c !== '' && r && t)
                {
                    this.insertComment(this.generateMemberComments(c, t, r));
                }

                break;

            case ts.SyntaxKind.Method:
                // _grunt.log.writeln("insert4: " + node);

                var t2 = true;

                try {
                    t2 = node.name.getText();
                }
                catch (e)
                {
                    t2 = false;
                }

                if (c !== '' && r && t2)
                {
                    this.insertComment(this.generateFunctionComments(c, t2, r));
                }

                break;
        }

        ts.forEachChild(node, this.delintNodeFunction);

    };

    return TypeScriptDocGenerator;

})();

module.exports = function (grunt) {

    _grunt = grunt;

    grunt.registerMultiTask('buildtsdoc', 'Generate a TypeScript def with comments', function () {
        var tsdg = new TypeScriptDocGenerator(this.data.tsDefFileName, this.data.jsdocJsonFileName);
        fs.writeFileSync(this.data.dest, tsdg.getTsDefCommentedFileContent(), 'utf8');
    });

};