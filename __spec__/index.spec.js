const aliasDirs = require("../index")

const paths = ["__spec__", "__spec__/src"]

describe("Alias Directories Function", () => {
	it("should initially alias the root and src directories with '~'", () => {
		const aliases = aliasDirs({ paths })

		expect(aliases).toEqual({
			"~components": "__spec__/src/components",
			"~containers": "__spec__/src/containers",
			"~example": "__spec__/example",
			"~pages": "__spec__/src/pages",
			"~src": "__spec__/src"
		})
	})

	it("should throw an error if a supplied directory doesn't exist", () => {
		global.console = { ...global.console, error: jest.fn() }

		aliasDirs()

		expect(console.error).toHaveBeenCalledWith(
			expect.stringContaining(
				"Error: ENOENT: no such file or directory, scandir './src'"
			)
		)

		global.console.error.mockRestore()
	})

	it("should alias the folders with a user defined string", () => {
		const aliases = aliasDirs({ paths, alias: "$" })

		expect(aliases).toEqual({
			$components: "__spec__/src/components",
			$containers: "__spec__/src/containers",
			$example: "__spec__/example",
			$pages: "__spec__/src/pages",
			$src: "__spec__/src"
		})
	})

	it("should display a warning if an alias is an empty string or uses '@' symbol", () => {
		global.console = { ...global.console, warn: jest.fn() }
		aliasDirs({ paths, alias: "@" })

		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining(
				"Warning: Using an empty string or the @ symbol as an alias may conflict with npm package name spaces. It's highly recommended that you use another alias symbol"
			)
		)

		global.console.warn.mockClear()

		aliasDirs({ paths, alias: "" })

		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining(
				"Warning: Using an empty string or the @ symbol as an alias may conflict with npm package name spaces. It's highly recommended that you use another alias symbol"
			)
		)

		global.console.warn.mockRestore()
	})

	it("should display a warning if an no folders were aliased", () => {
		global.console = { ...global.console, warn: jest.fn() }
		aliasDirs({
			paths,
			ignoreDirectories: [
				...aliasDirs.ignoreDirectories,
				"components",
				"containers",
				"example",
				"pages",
				"src"
			]
		})

		expect(console.warn).toHaveBeenCalledWith(
			expect.stringContaining(
				"Warning: Unable to locate any directories to alias! Please make sure the provided directories do not conflict with these currently ignored directories: [build,config,coverage,cypress,dist,env,public,components,containers,example,pages,src,node_modules]"
			)
		)

		global.console.warn.mockClear()
	})

	it("should supress warnings if the 'suppressWarnings' prop is true", () => {
		global.console = { ...global.console, warn: jest.fn() }
		aliasDirs({ paths, alias: "@", suppressWarnings: true })

		expect(console.warn).toHaveBeenCalledTimes(0)

		global.console.warn.mockRestore()
	})

	it("should override predefined ignored directories with user defined directories", () => {
		const aliases = aliasDirs({ paths, ignoreDirectories: ["example", "src"] })

		expect(aliases).toEqual({
			"~components": "__spec__/src/components",
			"~containers": "__spec__/src/containers",
			"~pages": "__spec__/src/pages",
			"~public": "__spec__/public"
		})
	})

	it("should extend predefined ignored user defined folders", () => {
		const aliases = aliasDirs({
			paths,
			ignoreDirectories: [...aliasDirs.ignoreDirectories, "example"]
		})

		expect(aliases).toEqual({
			"~components": "__spec__/src/components",
			"~containers": "__spec__/src/containers",
			"~pages": "__spec__/src/pages",
			"~src": "__spec__/src"
		})
	})

	it("should log messages if 'debug' is set to true", () => {
		global.console = { ...global.console, log: jest.fn() }

		aliasDirs({
			paths,
			debug: true
		})

		expect(console.log.mock.calls[0][0]).toEqual(
			expect.stringContaining(
				"Debug: Traversing paths... [__spec__,__spec__/src]"
			)
		)

		expect(console.log.mock.calls[1][0]).toEqual(
			expect.stringContaining("Debug: Using alias... (~)")
		)

		expect(console.log.mock.calls[2][0]).toEqual(
			expect.stringContaining(
				"Debug: Ignoring directories... [build,config,coverage,cypress,dist,env,public,node_modules]"
			)
		)

		expect(console.log.mock.calls[3][0]).toEqual(
			expect.stringContaining(
				'Debug: Aliasing directories... {"~example":"__spec__/example","~src":"__spec__/src","~components":"__spec__/src/components","~containers":"__spec__/src/containers","~pages":"__spec__/src/pages"}'
			)
		)

		global.console.log.mockRestore()
	})
})
