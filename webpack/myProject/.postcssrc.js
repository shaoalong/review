
// https://github.com/michael-ciniawsky/postcss-load-config
console.log(process.env.NODE_ENV);
console.log('postcssrc');
module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {},
    "postcss-px2rem": { remUnit: '75' },
  }
}
