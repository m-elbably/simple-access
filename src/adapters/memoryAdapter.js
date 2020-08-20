const _ = require('lodash');
const BaseAdapter = require('./baseAdapter');
const { LibError, ERROR_NAMES } = require('../common/errors');

class MemoryAdapter extends BaseAdapter {
  constructor(roles) {
    super();
    this.roles = roles;
  }

  async getRolesByName(roles) {
    const outRoles = [];

    if (this.roles == null || !_.isObject(this.roles)) {
      throw new LibError(ERROR_NAMES.VALIDATION_ERROR, `Missing/Invalid roles in "${this.constructor.name}"`);
    }

    for (let i = 0; i < roles.length; i += 1) {
      if (this.roles[roles[i]] != null) {
        outRoles.push(this.roles[roles[i]]);
      }
    }

    return outRoles;
  }
}

module.exports = MemoryAdapter;
