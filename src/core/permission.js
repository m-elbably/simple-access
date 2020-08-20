class Permission {
  /**
   *
   * @param config
   * {
   *   granted: {type: 'boolean'},
   *   access: {
   *     roles: [{type: 'string'}],
   *     resources: {type: 'string'},
   *     action: {type: 'string'}
   *   },
   *   grants: {type: 'object'},
   *   fields: [{type: 'string'}],
   *   conditions: [{type: 'string'}]
   * }
   */
  constructor(config) {
    const {
      granted, access, grants, fields, conditions
    } = config;

    this.granted = granted;
    this.access = access;
    this.grants = grants;
    this.fields = fields;
    this.conditions = conditions;
  }
}

module.exports = Permission;
