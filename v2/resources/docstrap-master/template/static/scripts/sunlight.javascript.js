(function(sunlight, undefined){

	if (sunlight === undefined || sunlight["registerLanguage"] === undefined) {
		throw "Include sunlight.js before including language files";
	}
	
	sunlight.registerLanguage("javascript", {
		keywords: [
			//keywords
			"break", "case", "catch", "continue", "default", "delete", "do", 
			"else",	"finally", "for", "function", "if", "in", "instanceof",
			"new", "return", "switch", "this", "throw", "try", "typeof", 
			"var", "void", "while", "with",
			
			//literals
			"true", "false", "null"
		],
		
		customTokens: {
			reservedWord: {
				values: [
					"abstract", "boolean", "byte", "char", "class", "const", "debugger", "double",
					"enum", "export", "extends", "final", "float", "goto", "implements", "import",
					"int", "interface", "long", "native", "package", "private", "protected", "public",
					"short", "static", "super", "synchronized", "throws", "transient", "volatile"
				],
				boundary: "\\b"
			},
			
			globalVariable: {
				values: ["NaN", "Infinity", "undefined"],
				boundary: "\\b"
			},
			
			globalFunction: {
				values: ["encodeURI", "encodeURIComponent", "decodeURI", "decodeURIComponent", "parseInt", "parseFloat", "isNaN", "isFinite", "eval"],
				boundary: "\\b"
			},
			
			globalObject: {
				values: [
					"Math", "JSON",
					"XMLHttpRequest", "XDomainRequest", "ActiveXObject",
					"Boolean", "Date", "Array", "Image", "Function", "Object", "Number", "RegExp", "String"
				],
				boundary: "\\b"
			}
		},

		scopes: {
			string: [ ["\"", "\"", sunlight.util.escapeSequences.concat(["\\\""])], ["'", "'", sunlight.util.escapeSequences.concat(["\\\'", "\\\\"])] ],
			comment: [ ["//", "\n", null, true], ["/*", "*/"] ]
		},
		
		customParseRules: [
			//regex literal
			function(context) {
				var peek = context.reader.peek(),
					isValid,
					regexLiteral = "/",
					line = context.reader.getLine(),
					column = context.reader.getColumn(),
					charClass = false,
					peek2,
					next;
					
				if (context.reader.current() !== "/" || peek === "/" || peek === "*") {
					//doesn't start with a / or starts with // (comment) or /* (multi line comment)
					return null;
				}
				
				isValid = function() {
					var previousNonWsToken = context.token(context.count() - 1),
						previousToken = null;
					if (context.defaultData.text !== "") {
						previousToken = context.createToken("default", context.defaultData.text); 
					}
					
					if (!previousToken) {
						previousToken = previousNonWsToken;
					}
					
					//first token of the string
					if (previousToken === undefined) {
						return true;
					}
					
					//since JavaScript doesn't require statement terminators, if the previous token was whitespace and contained a newline, then we're good
					if (previousToken.name === "default" && previousToken.value.indexOf("\n") > -1) {
						return true;
					}
					
					if (sunlight.util.contains(["keyword", "ident", "number"], previousNonWsToken.name)) {
						return false;
					}
					if (previousNonWsToken.name === "punctuation" && !sunlight.util.contains(["(", "{", "[", ",", ";"], previousNonWsToken.value)) {
						return false;
					}
					
					return true;
				}();
				
				if (!isValid) {
					return null;
				}
				
				//read the regex literal
				while (context.reader.peek() !== context.reader.EOF) {
					peek2 = context.reader.peek(2);
					if (peek2 === "\\/" || peek2 === "\\\\") {
						//escaped backslash or escaped forward slash
						regexLiteral += context.reader.read(2);
						continue;
					}
					if (peek2 === "\\[" || peek2 === "\\]") {
						regexLiteral += context.reader.read(2);
						continue;
					} else if (next === "[") {
						charClass = true;
					} else if (next === "]") {
						charClass = false;
					}
					
					regexLiteral += (next = context.reader.read());
					if (next === "/" && !charClass) {
						break;
					}
				}
				
				//read the regex modifiers
				//only "g", "i" and "m" are allowed, but for the sake of simplicity we'll just say any alphabetical character is valid
				while (context.reader.peek() !== context.reader.EOF) {
					if (!/[A-Za-z]/.test(context.reader.peek())) {
						break;
					}
					
					regexLiteral += context.reader.read();
				}
				
				return context.createToken("regexLiteral", regexLiteral, line, column);
			}
		],
		
		identFirstLetter: /[$A-Za-z_]/,
		identAfterFirstLetter: /[\w\$]/,
		
		namedIdentRules: {
			follows: [
				[{ token: "keyword", values: ["function"] }, sunlight.util.whitespace]
			]
		},

		operators: [
			//arithmetic
			"++", "+=", "+",
			"--", "-=", "-",
			      "*=", "*",
			      "/=", "/",
			      "%=", "%",

			//boolean
			"&&", "||",

			//bitwise
			"|=",   "|",
			"&=",   "&",
			"^=",   "^",
			">>>=", ">>>", ">>=", ">>",
			"<<=", "<<",

			//inequality
			"<=", "<",
			">=", ">",
			"===", "==", "!==", "!=",

			//unary
			"!", "~",

			//other
			"?", ":", ".", "="
		]
	});
}(this["Sunlight"]));