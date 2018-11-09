var webpack = require('webpack');

var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var inProduction = (process.env.NODE_ENV === 'production');

// var { VueLoaderPlugin } = require('vue-loader');


module.exports = {

  entry: {
     app: ['./src/main.js', './src/main.scss'] ,
     vendor: ['vue']
  },

  output: {

    path: path.resolve(__dirname,'./dist'),

    filename: '[name].js'

  },

  module: {

    rules: [
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
           use: ['css-loader', 'postcss-loader', 'sass-loader'],
           fallback: 'style-loader' 
        })
      },

      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },

      // {
      //     test: /\.vue$/,
      //     loader: 'vue-loader',
      // }

    ]
  },

   resolve: {

        alias: {
          'vue$': 'vue/dist/vue.esm.js' 
        }

    },

  plugins: [
  
      new ExtractTextPlugin('./css/[name].css'),

      new webpack.LoaderOptionsPlugin({
        minimize: inProduction
      }),

      // new webpack.optimize.CommonsChunkPlugin({
      //    name: ['vendor']
      // }),

      // new VueLoaderPlugin(),

      // new WebpackBar({
      //    profile: true
      // })

  ]

};

if(inProduction) {

  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  );

}
