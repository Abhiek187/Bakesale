module.exports = {
	parser: "babel-eslint",
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		jest: true
	},
	extends: ["eslint:recommended", "plugin:react/recommended"],
	parserOptions: {
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			jsx: true
		},
		sourceType: "module"
	},
	plugins: ["react"],
	rules: {
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"no-console": ["warn", { allow: ["info", "error"] }],
		"arrow-parens": ["error", "always"],
		"prefer-const": "error"
	}
};
