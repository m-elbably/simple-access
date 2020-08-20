/* eslint no-unused-expressions: off */
const chai = require('chai');

const { SimpleAccess, MemoryAdapter } = require('../src/index');
const { LibError, ERROR_NAMES } = require('../src/common/errors');
const { RESOURCES, ROLES } = require('./data/memoryRoles');

const { expect } = chai;
let acl;
let adapter;

before(async () => {
  adapter = new MemoryAdapter(ROLES);
  acl = new SimpleAccess({
    adapter,
  });
});

// TODO - Role missing/empty error check

describe('Test MemoryAdapter', () => {
  it('Should create a new MemoryAdapter and SimpleAccess instances', async () => {
    expect(adapter).to.be.an('object');
  });

  it('Should create a new MemoryAdapter and SimpleAccess instances', async () => {
    expect(acl).to.be.an('object');
  });

  it('Should return empty array because role(s) does not exists', async () => {
    const result = await adapter.getRolesByName('none');

    expect(result).to.be.an('array')
      .with.lengthOf(0);
  });
});

describe('Test core functions - can (basic roles)', () => {
  it('Should return error object with "name" property equal to "CAN_INVALID_PARAM", if roles param is invalid', async () => {
    try {
      await acl.can(null, 'create', 'product');
    } catch (e) {
      // eslint-disable-next-line no-unused-expressions
      expect(e).to.be.instanceOf(Error)
        .with.property('name')
        .to.be.equal(ERROR_NAMES.INVALID_PARAM);
    }
  });

  it('Should return error object with "name" property equal to "CAN_MISSING_ROLE", if role does not exists', async () => {
    try {
      await acl.can('finance', 'create', 'product');
    } catch (e) {
      // eslint-disable-next-line no-unused-expressions
      expect(e).to.be.instanceOf(Error)
        .with.property('name')
        .to.be.equal(ERROR_NAMES.MISSING_ROLE);
    }
  });

  it('Should return permission object with [granted, access, grants, fields, conditions] attrs', async () => {
    const permissionKeys = ['granted', 'access', 'grants', 'fields', 'conditions'];
    const accessKeys = ['roles', 'resource', 'action'];
    const result = await acl.can(['support'], 'read', 'product');

    // eslint-disable-next-line no-unused-expressions
    expect(result)
      .to.be.an('object')
      .to.include.all.keys(permissionKeys)
      .with.property('access')
      .to.include.all.keys(accessKeys);
  });

  it('Should return permission object with "granted" equal to "true"', async () => {
    const result = await acl.can(['support'], 'read', 'product');

    // eslint-disable-next-line no-unused-expressions
    expect(result)
      .to.be.an('object')
      .with.property('granted')
      .to.be.true;
  });

  it('Should return permission object with "granted" equal to "false"', async () => {
    const result = await acl.can(['support'], 'create', 'product');

    // eslint-disable-next-line no-unused-expressions
    expect(result)
      .to.be.an('object')
      .with.property('granted')
      .to.be.false;
  });

  it('Should return permission object with "granted" equal to "false", if resource does not exists', async () => {
    const result = await acl.can(['support'], 'create', 'foo');

    expect(result)
      .to.be.an('object')
      .with.property('granted')
      .to.be.false;
  });

  it('Should return permission object with "granted" equal to "false", if action does not exists', async () => {
    const result = await acl.can(['support'], 'remove', 'product');

    expect(result)
      .to.be.an('object')
      .with.property('granted')
      .to.be.false;
  });

  it('Should return permission object with "granted" equal to "false", if subject has no grants', async () => {
    const result = await acl.can(['public'], 'read', 'product');

    expect(result)
      .to.be.an('object')
      .with.property('granted')
      .to.be.false;
  });
});

describe('Test core functions - can (roles intersection)', () => {
  it('Should return permission object with grants object including 3 resources access, and granted is "true"', async () => {
    const grantedResources = [RESOURCES.USER, RESOURCES.PRODUCT, RESOURCES.ORDER];
    const result = await acl.can(['support', 'operation'], 'read', 'user');

    expect(result)
      .to.be.an('object')
      .with.property('grants')
      .to.be.an('object');

    expect(result.grants)
      .to.include.all.keys(grantedResources);
  });

  it('Should return permission object with grants object including 2 resources access, and granted is "false"', async () => {
    const grantedResources = [RESOURCES.PRODUCT, RESOURCES.ORDER];
    const result = await acl.can(['public', 'operation'], 'read', 'user');

    expect(result)
      .to.be.an('object')
      .with.property('grants')
      .to.be.an('object');

    expect(result.grants)
      .to.include.all.keys(grantedResources);

    expect(Object.keys(result.grants))
      .to.have.lengthOf(grantedResources.length);

    expect(result)
      .to.be.an('object')
      .with.property('granted')
      .to.be.false;
  });

  it('Should return grants object with "product" "read" action for "operation" role override "public" role', async () => {
    const result = await acl.can(['visitor', 'operation'], 'read', 'user');
    const resource = result.grants[RESOURCES.PRODUCT];

    expect(resource)
      .to.be.an('object')
      .with.property('read')
      .to.be.an('object')
      .with.property('fields')
      .to.be.an('array')
      .with.length(1)
      .and.include('*');

    expect(resource)
      .to.be.an('object')
      .with.property('read')
      .to.be.an('object')
      .and.not.with.property('conditions');
  });

  it('Should return grants object with "product" "read" action for "support" role override "public" role', async () => {
    const result = await acl.can(['public', 'support'], 'read', 'user');
    const resource = result.grants[RESOURCES.PRODUCT];

    expect(resource)
      .to.be.an('object')
      .with.property('read')
      .to.be.an('object')
      .with.property('fields')
      .to.be.an('array')
      .and.to.eql(['*', '!createdBy']);

    expect(resource)
      .to.be.an('object')
      .with.property('read')
      .to.be.an('object')
      .with.property('conditions')
      .to.be.an('array')
      .with.length(0);
  });
});

describe('Test Conditions', () => {
  const user = {
    _id: 3,
    roles: ['operation'],
    address: {
      country: 'egypt'
    },
    createdAt: new Date('2020-12-21T06:00:00Z')
  };

  const resource = {
    name: 'Jhon Mart',
    owner: 2,
    description: '',
    details: {
      country: 'egypt',
    },
    active: true
  };

  it('Should return parsed object with "user._id" = 3', async () => {
    const result = acl.parseCondition({
      'resource.owner': { $eq: 'user._id' }
    }, user, resource);

    expect(result)
      .to.be.an('object')
      .with.property('resource.owner')
      .to.be.an('object')
      .with.property('$eq')
      .to.be.eq(3);
  });

  it('Should return parsed object with "value" = "egypt" and "query" = { $in: ["egypt", "usa", "canada"] }', async () => {
    const result = acl.parseCondition({
      'user.address.country': { $in: ['egypt', 'usa', 'canada'] }
    }, user, resource);

    expect(result)
      .to.be.an('object')
      .and.to.include.all.keys(['query', 'value']);

    expect(result)
      .with.property('value')
      .to.be.eq('egypt');

    expect(result)
      .with.property('query')
      .to.be.an('object')
      .with.property('$in')
      .to.be.an('array')
      .with.length(3);
  });

  it('Should return parsed object with "value" = "undefined" and "query" = { $in: ["egypt", "usa", "canada"] }', async () => {
    const result = acl.parseCondition({
      'user.details.country': { $in: ['egypt', 'usa', 'canada'] }
    }, user, resource);

    expect(result)
      .to.be.an('object')
      .with.property('value')
      .to.be.undefined;
  });

  it('Should return validation result = false if resource._id != user._id', async () => {
    const permission = await acl.can(['user'], 'update', 'product');
    const result = acl.validatePermission(permission, user, resource);

    expect(result)
      .to.be.false;
  });

  it('Should return validation result = false if resource.active == false', async () => {
    resource.active = false;
    const permission = await acl.can(['user'], 'read', 'product');
    const result = acl.validatePermission(permission, user, resource);

    expect(result)
      .to.be.false;
  });

  it('Should return validation result = false if user.createdAt >= specific date', async () => {
    const permission = await acl.can(['support'], 'update', 'user');
    const result = acl.validatePermission(permission, user, resource);

    expect(result)
      .to.be.false;
  });

  it('Should return validation result = true if resource._id == user._id', async () => {
    resource._id = 3;
    const permission = await acl.can(['user'], 'update', 'product');
    const result = acl.validatePermission(permission, user, resource);

    expect(result)
      .to.be.true;
  });

  it('Should return validation result = true if resource.active == true', async () => {
    resource.active = true;
    const permission = await acl.can(['user'], 'read', 'product');
    const result = acl.validatePermission(permission, user, resource);

    expect(result)
      .to.be.true;
  });

  it('Should return validation result = false if user.createdAt <= specific date', async () => {
    user.createdAt = new Date('2020-04-21T06:00:00Z');
    const permission = await acl.can(['support'], 'update', 'user');
    const result = acl.validatePermission(permission, user, resource);

    expect(result)
      .to.be.true;
  });
});
