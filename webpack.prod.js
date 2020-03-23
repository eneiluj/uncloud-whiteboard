const webpack = require("webpack");
const path = require("path");

module.exports = {
	devtool: 'source-map',	
	mode: 'production',	
	entry: {
		'main' : "./src/main.js"
	},

	output: {
		path: path.resolve(__dirname, "js"),
		filename: "[name].js",
		jsonpFunction: "webpackJsonpWhiteboard"
	  },

	node: {
		fs: 'empty'
	}
}

