const aliasDirs = require("../index")

module.exports = api => {
	api.cache.using(() => process.env.NODE_ENV)

	return {
		presets: ["next/babel"],
		plugins: [
			[
				"module-resolver",
				{
					alias: aliasDirs()
				}
			]
		]
	}
}
