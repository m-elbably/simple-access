const BaseAdapter = require('./baseAdapter');

class MemoryAdapter extends BaseAdapter {
  constructor(db) {
    super();
    this._db = db;
  }

  async getRolesByName(roles) {

  }
}

module.exports = MemoryAdapter;
