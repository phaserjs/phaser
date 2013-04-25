var exec = require('child_process').exec;
var path = require('path');


/**
 * open a file or uri using the default application for the file type.
 * @return {ChildProcess} - the child process object.
 * @param {string} target - the file/uri to open.
 * @param {function(Error)} callback - null on success, or an error object
 *      that contains a property 'code' with the exit code of the process.
 */
module.exports = open;
function open(target, callback) {
  var opener;

  switch (process.platform) {
    case 'darwin':
      opener = 'open';
      break;
    case 'win32':
      // if the first parameter to start is quoted, it uses that as the title
      // so we pass a blank title so we can quote the file we are opening
      opener = 'start ""';
      break;
    default:
      // use Portlands xdg-open everywhere else
      opener = path.join(__dirname, '../vendor/xdg-open');
      break;
  }

  // TODO: what are the implications of quoting target?
  //  - we'll need to look at target to see if its already quoted
  //  - different platforms may treat quotes differently
  return exec(opener + ' "' + escape(target) + '"', callback);
}

function escape(s) {
  return s.replace(/"/, '\\\"');
}
