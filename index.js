var markdownpdf = require("markdown-pdf");
var glob        = require("glob");
var split       = require("split");
var through     = require("through");
var duplexer    = require("duplexer");
var processUtil = require('./util/md.js');
var book_path   = "bin/book.pdf";

var glob_opts = {};
var pdf_opts  = {
  remarkable: {
    html: true,
    breaks: true,
    plugins: [ require('remarkable-classy'), require('highlight.js') ],
    syntax: [ 'footnote', 'sup', 'sub' ]
  },
  preProcessMd: preProcessMd,
};
pdf_opts.cssPath = 'src/assets/styles/main.css';
pdf_opts.highlightCssPath = 'node_modules/highlight.js/styles/hybrid.css';
pdf_opts.paperBorder = '3.5cm';

function preProcessMd() {
  var splitter = split();
  var replacer = through(function (data) {
    processUtil.forEach(function(utility) {
      var matches = data.match(utility.regex);
      if (matches) {
        matches.forEach(function(value, index) {
          data = utility.process(value, index, data);
        });
      }
    });
    this.queue(data+"\n");
  });
  splitter.pipe(replacer);
  return duplexer(splitter, replacer);
}

glob("./src/**/*.md", glob_opts, function (er, files) {
  console.log(files);
  markdownpdf(pdf_opts).concat.from(files).to(book_path, function () {
    console.log("Created", book_path)
  });

});