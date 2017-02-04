// angular2-template-loader modified for inline templates - For building purposes!
const fs = require('fs');
const CleanCss = require('clean-css');
const htmlmin = require('html-minifier').minify;

const templateUrlRegex = /templateUrl *:(.*)$/gm;
const stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
const stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;

function isCss(type) {
  return type && type === 'css';
}

function replaceStringsWithContents(string, type) {
  return string.replace(stringRegex, function (match, quote, url) {
    if (url.charAt(0) === ".") {
      url = url.replace("./", "./src/");
    }

    let contents = fs.readFileSync(url).toString();

    if (isCss(type)) {
      contents = "'" + new CleanCss({compatibility: 'ie8'}).minify(contents).styles + "'";
    } else {
      contents = "`" + htmlmin(contents, {collapseWhitespace: true, caseSensitive: true}) + "`";
    }

    return contents;
  });
}

module.exports = function(source, enc, cb) {
  let newSource = source.contents.toString();
  newSource = newSource.replace(templateUrlRegex, function (match, url) {
    // replace: templateUrl: './path/to/template.html'
    // with: template: require('./path/to/template.html')
    return "template:" + replaceStringsWithContents(url, 'html');
  })
  .replace(stylesRegex, function (match, urls) {
    // replace: stylesUrl: ['./foo.css', "./baz.css", "./index.component.css"]
    // with: styles: [require('./foo.css'), require("./baz.css"), require("./index.component.css")]
    return "styles:" + replaceStringsWithContents(urls, 'css');
  });
  source.contents = new Buffer(newSource);
  cb(null, source);
};
