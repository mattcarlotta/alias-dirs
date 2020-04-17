"use strict"

var _require = require("fs"),
	readdirSync = _require.readdirSync,
	statSync = _require.statSync

var _require2 = require("path"),
	resolve = _require2.resolve

var inTesting = process.env.NODE_ENV === "test"
var enforcedDirectories = ["node_modules"]
var ignorePredefindDirectories = [
	"build",
	"config",
	"coverage",
	"cypress",
	"dist",
	"env",
	"public"
]

function logMessage(message) {
	console.log("\x1b[36mDebug: ".concat(message).concat("\x1b[0m"))
}

function logWarning(message) {
	console.warn("\x1b[33mWarning: ".concat(message).concat("\x1b[0m"))
}

function logError(error) {
	console.error("\x1b[31m".concat(error).concat("\x1b[0m"))
}

var _default = function _default() {
	try {
		var _args =
			arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

		var paths =
				_args.paths && _args.paths[0] !== undefined
					? _args.paths
					: [".", "./src"],
			alias = typeof _args.alias === "string" ? _args.alias : "~",
			ignoredDirectories = (
				_args.ignoreDirectories || ignorePredefindDirectories
			).concat(enforcedDirectories),
			debug = _args.debug,
			suppressWarnings = _args.suppressWarnings

		if ((alias === "" || alias === "@") && !suppressWarnings) {
			logWarning(
				"Using an empty string or the @ symbol as an alias may conflict with npm package name spaces. It's highly recommended that you use another alias symbol."
			)
		}

		if (debug) {
			logMessage("Traversing paths... ".concat("[").concat(paths).concat("]"))
			logMessage("Using alias... ".concat("(").concat(alias).concat(")"))
			logMessage(
				"Ignoring directories... "
					.concat("[")
					.concat(ignoredDirectories)
					.concat("]")
			)
		}

		var aliases = paths.reduce(function (accumulatedAliasedPaths, path) {
			var aliasedPaths = readdirSync(path).reduce(function (acc, folder) {
				var dirPath = path.concat("/").concat(folder)

				if (
					!new RegExp(ignoredDirectories.join("|"), "i").test(folder) &&
					!new RegExp(/^[.]/, "g").test(folder) &&
					statSync(resolve(dirPath)).isDirectory()
				) {
					acc[alias.concat(folder.replace(/[^\w\s]/gi, ""))] = dirPath
				}

				return acc
			}, {})
			return Object.assign({}, accumulatedAliasedPaths, aliasedPaths)
		}, [])
		if ((!aliases || Object.keys(aliases).length === 0) && !suppressWarnings)
			logWarning(
				"Unable to locate any directories to alias! Please make sure the provided directories do not conflict with these currently ignored directories: "
					.concat("[")
					.concat(ignoredDirectories.toString())
					.concat("]")
			)
		if (debug)
			logMessage("Aliasing directories... ".concat(JSON.stringify(aliases)))
		return aliases
	} catch (error) {
		logError(error)
		/* istanbul ignore next */
		if (!inTesting) process.exit(1)
	}
}

module.exports = _default
module.exports.ignoreDirectories = ignorePredefindDirectories
