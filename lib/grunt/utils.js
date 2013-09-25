module.exports = {

  process: function(content, version) {
    return content
      .replace('{version}', version)
      .replace('{buildDate}', (new Date()).toUTCString());
  }

};
