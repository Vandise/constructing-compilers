var fs = require('fs');

module.exports = {
  regex: /(<import ([^>]+)>)/ig,
  process: function(value, index, data) {
    var md = value.match(/type="(.*?)" src="(.*?)"/);
    var contents = fs.readFileSync('src/'+md[2], 'utf8');
    return data.replace(value, '```' + md[1] + "\n" + contents + "\n" + '```' + "\n");
  },
};