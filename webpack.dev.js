//const webpack = require("webpack");
const path = require("path");

module.exports = {
	devtool: 'source-map',	
	mode: 'none',	
	entry: {
		'main': "./src/main.js"
	},

	output: {
		path: path.resolve(__dirname, "js"),
		filename: "[name].js",
		jsonpFunction: "webpackJsonpFileWhiteboard"
	  },

	  node: {
		fs: 'empty'
	  }


}

