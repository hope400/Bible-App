

let _io = null;

module.exports = {

  init(io) {
    _io = io;
  },


  emit(event, data) {
    if (_io) {
      _io.emit(event, data);
    }
  },

  getIO() {
    return _io;
  }
};