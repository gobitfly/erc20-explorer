
function nameFormatter(config) {
  this.conf = config;
  
  this.format = function(address) {
    if (this.conf.names[address]) {
      return address.substr(0, 10) + "... (" + this.conf.names[address] + ")";
    } else {
      return address;
    }
  }
}
module.exports = nameFormatter;