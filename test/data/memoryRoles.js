const RESOURCES = {
  CONFIG: 'config',
  FILE: 'file',
  USER: 'user',
  ORDER: 'order',
  PRODUCT: 'product'
};

module.exports = {
  RESOURCES,
  ROLES: {
    admin: {
      name: 'admin',
      priority: 1000,
      resources: {
        [RESOURCES.CONFIG]: {
          create: { fields: ['*'] },
          read: { fields: ['*'] },
          update: { fields: ['*'] },
          delete: { fields: ['*'] },
        },
        [RESOURCES.FILE]: {
          create: { fields: ['*'] },
          read: { fields: ['*'] },
          update: { fields: ['*'] },
          delete: { fields: ['*'] }
        },
        [RESOURCES.USER]: {
          create: { fields: ['*'] },
          read: { fields: ['*'] },
          update: { fields: ['*'] },
          delete: { fields: ['*'] }
        },
        [RESOURCES.ORDER]: {
          create: { fields: ['*'] },
          read: { fields: ['*'] },
          update: { fields: ['*'] },
          delete: { fields: ['*'] }
        },
        [RESOURCES.PRODUCT]: {
          create: { fields: ['*'] },
          read: { fields: ['*'] },
          update: { fields: ['*'] },
          delete: { fields: ['*'] }
        },
      },
    },
    operation: {
      name: 'operation',
      priority: 999,
      resources: {
        [RESOURCES.ORDER]: {
          read: { fields: ['*'] },
          update: { fields: ['status', 'items'] }
        },
        [RESOURCES.PRODUCT]: {
          create: { fields: ['*', '!active'] },
          read: { fields: ['*'] },
          update: { fields: ['*', '!active'] }
        }
      },
    },
    support: {
      name: 'support',
      priority: 998,
      resources: {
        [RESOURCES.USER]: {
          read: { fields: ['*', '!password'] },
          update: {
            fields: ['firstName', 'lastName'],
            conditions: [{ 'user.createdAt': { $lte: new Date('2020-10-21T06:00:00Z') } }]
          },
        },
        [RESOURCES.ORDER]: {
          read: { fields: ['*'] },
          update: { fields: ['status', 'items'] }
        },
        [RESOURCES.PRODUCT]: {
          read: { fields: ['*', '!createdBy'], conditions: [] },
        }
      },
    },
    user: {
      name: 'user',
      priority: 997,
      resources: {
        [RESOURCES.USER]: {
          create: { fields: ['*', '!active'] },
          read: {
            fields: ['*'],
            conditions: [{ 'resource._id': { $eq: 'user._id' } }]
          },
          update: {
            fields: ['*', '!active'],
            conditions: [{ 'resource._id': { $eq: 'user._id' } }]
          },
        },
        [RESOURCES.ORDER]: {
          read: {
            fields: ['*'],
            conditions: [{ 'resource._id': { $eq: 'user._id' } }]
          },
          update: {
            fields: ['status', 'items'],
            conditions: [{ 'resource._id': { $eq: 'user._id' } }]
          }
        },
        [RESOURCES.PRODUCT]: {
          read: {
            fields: ['*'],
            conditions: [{ 'resource.active': { $eq: true } }]
          },
          update: {
            fields: ['status', 'items'],
            conditions: [{ 'resource._id': { $eq: 'user._id' } }]
          }
        }
      },
    },
    visitor: {
      name: 'visitor',
      priority: 996,
      resources: {
        [RESOURCES.PRODUCT]: {
          read: {
            fields: ['*', '!active'],
            conditions: [{ 'resource.active': { $eq: true } }]
          },
        }
      },
    },
    public: {
      name: 'public',
      priority: 995,
      resources: {
      },
    }
  }
};
