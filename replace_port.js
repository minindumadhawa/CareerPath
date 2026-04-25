const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.js') || file.endsWith('.json')) results.push(file);
    }
  });
  return results;
}

const files = walk('/Users/mac/Desktop/CareerPath/frontend');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('5000')) {
    fs.writeFileSync(f, content.replace(/5000/g, '5001'));
    console.log('Updated ' + f);
  }
});
