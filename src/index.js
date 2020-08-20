const _ = require('lodash');
const Ajv = require('ajv');
const sift = require('sift');

const adapters = require('./adapters');
const utils = require('./common/utils');
const { roleSchema, permissionSchema } = require('./common/schemas');
const { LibError, ERROR_NAMES } = require('./common/errors');

const USER_PREFIX = 'user.';
const RESOURCE_PREFIX = 'resource.';

class SimpleAccess {
  constructor(config) {
    const { adapter } = config;
    this.adapter = adapter;

    if (!adapter) {
      throw new Error('Roles adapter is missing');
    }
  }

  validateSchema(schema, data) {
    const ajv = new Ajv();
    const valid = ajv.validate(schema, data);
    if (!valid) {
      const { name } = data;
      const message = `Invalid role schema at "${name || 'MISSING_NAME'}":\n${JSON.stringify(ajv.errors)}`;
      throw new LibError(ERROR_NAMES.VALIDATION_ERROR, message);
    }

    return valid;
  }

  validateArgs(args) {
    Object.keys(args).forEach((arg) => {
      if (args[arg] == null || args[arg].length === 0) {
        throw new LibError(ERROR_NAMES.INVALID_PARAM, `"${arg}" argument is required and can not be null or empty`);
      }
    });

    const { roles } = args;
    if (Array.isArray(roles)) {
      roles.forEach((role) => {
        if (role == null || role.length === 0) {
          throw new LibError(ERROR_NAMES.INVALID_PARAM, 'Roles can not be null or empty');
        }
      });
    }
  }

  /**
   *
   * @param role: Role to merge its resources into destination obj
   * @param destination: destination object
   */
  mergeRoleResources(role, destination, maxPriority) {
    const { priority, resources } = role;
    const dest = destination;
    const hasHighPriority = (maxPriority == null || priority > maxPriority);

    if (!_.isObject(resources) || Object.keys(resources).length === 0) {
      return;
    }

    Object.keys(resources).forEach((resource) => {
      if (!_.isObject(resources[resource])) {
        return;
      }

      if (dest[resource] == null) {
        // Clone
        dest[resource] = { ...resources[resource] };
      } else {
        // If resources exists, Merge actions
        Object.keys(resources[resource]).forEach((action) => {
          // If action does not exists, or role priority > maxPriority override/create action
          if (dest[resource][action] == null || hasHighPriority) {
            // Clone
            dest[resource][action] = { ...resources[resource][action] };
          }
        });
      }
    });
  }

  getConditionValue(arg, user, resource) {
    let value = arg;
    let path;
    let destObj;

    if (arg !== null && _.isString(arg) && arg.length > 0) {
      if (arg.indexOf(USER_PREFIX) === 0) {
        path = arg.substr(USER_PREFIX.length);
        destObj = user;
      } if (arg.indexOf(RESOURCE_PREFIX) === 0) {
        path = arg.substr(RESOURCE_PREFIX.length);
        destObj = resource;
      }

      if (destObj != null) {
        value = _.get(destObj, path);
      }
    }

    return value;
  }

  /**
   * Convert/Substitute "user, resource" prefix with actual values from objects
   * It will not touch keys or object only values
   * Ex. object:
   * {
   *   "user._id": {"$eq": "resource._id"}
   * }
   *
   * Only "resource._id" will be substituted
   * @param condition
   * @param user
   * @param resource
   * @returns object
   */
  parseCondition(condition, user, resource) {
    let result = {};
    if (utils.isString(condition)) {
      result = this.getConditionValue(condition, user, resource);
    } else if (utils.isObject(condition)) {
      Object.entries(condition).forEach((e) => {
        result[e[0]] = this.parseCondition(e[1], user, resource);
      });
    }

    return result;
  }

  /**
   *
   * @param roles:
   * @param action
   * @param resource
   * @return: Permission: {
   *   granted: {type: 'boolean'},
   *   access: {
   *     roles: [{type: 'string'}],
   *     resource: {type: 'string'},
   *     action: {type: 'string'}
   *   },
   *   grants: {type: 'object'},
   *   fields: [{type: 'string'}],
   *   conditions: [{type: 'string'}]
   * }
   */
  async can(roles, action, resource) {
    let bPriority;
    const bResources = {};
    const permission = {
      granted: false,
      access: {
        roles,
        resource,
        action
      },
      grants: {},
      fields: [],
      conditions: []
    };

    this.validateArgs({ roles, action, resource });

    // Get role(s)
    const userRoles = Array.isArray(roles) ? roles : [roles];
    permission.access.roles = userRoles;
    const adapterRoles = await this.adapter.getRolesByName(userRoles);

    if (adapterRoles == null || adapterRoles.length !== userRoles.length) {
      const diff = _.difference(userRoles, adapterRoles.map((r) => r.name));
      throw new LibError(ERROR_NAMES.MISSING_ROLE, `Role(s) [${diff.toString()}] does not exists`);
    }

    if (adapterRoles.length > 0) {
      for (let i = 0; i < adapterRoles.length; i += 1) {
        // Validate role schema
        this.validateSchema(roleSchema, adapterRoles[i]);
        // Merge resource if possible
        const { priority } = adapterRoles[i];
        this.mergeRoleResources(adapterRoles[i], bResources, bPriority);
        if (bPriority == null || priority > bPriority) {
          bPriority = priority;
        }
      }

      permission.grants = bResources;
      // Validate resource & ability, then update permission
      if (bResources[resource] != null && bResources[resource][action] != null) {
        const { fields, conditions } = bResources[resource][action];
        permission.fields = fields || [];
        permission.conditions = conditions || [];
        permission.granted = true;
      }
    }

    return permission;
  }

  /**
   * check if subject permission can access specific resource (object)
   * @param user: user object
   * @param resource: resource object
   * @param permission:
   * {
   *   granted: {type: 'boolean'},
   *   access: {
   *     roles: [{type: 'string'}],
   *     resource: {type: 'string'},
   *     action: {type: 'string'}
   *   },
   *   grants: {type: 'object'},
   *   fields: [{type: 'string'}],
   *   conditions: [{type: 'string'}]
   * }
   * @return boolean
   */
  validatePermission(permission, user, resource) {
    const { granted, conditions } = permission;

    if (granted === true) {
      if (conditions == null || conditions.length === 0) {
        return true;
      }

      let siftCheck = false;
      for (let i = 0; i < conditions.length; i += 1) {
        const condition = conditions[i];
        if (!utils.isObject(condition)) {
          throw new LibError(ERROR_NAMES.VALIDATION_ERROR, 'Condition must be an object');
        }
        const [[value, query]] = Object.entries(condition);
        const pValue = this.parseCondition(value, user, resource);
        const pQuery = this.parseCondition(query, user, resource);
        siftCheck = sift(pQuery).call(this, pValue);
        if (!siftCheck) {
          break;
        }
      }

      return siftCheck;
    }

    return false;
  }

  filter(permission, resource) {

  }
}

module.exports = {
  SimpleAccess,
  ...adapters,
};
