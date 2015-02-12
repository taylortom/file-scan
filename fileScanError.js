function FileScanError(message) {
  this.name = 'FileScanError';
  this.message = message || 'cannot continue';
}

FileScanError.prototype = Object.create(Error.prototype);
FileScanError.prototype.constructor = FileScanError;

exports = module.exports = FileScanError;
