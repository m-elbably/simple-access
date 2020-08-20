module.exports = {
  permissionSchema: {
    type: 'object',
    properties: {
      granted: { type: 'boolean' },
      access: {
        type: 'object',
        properties: {
          role: { type: 'string' },
          resource: { type: 'string' },
          action: { type: 'string' },
        },
      },
      grants: { type: 'object' },
      fields: {
        type: 'array',
        maxItems: 1024,
        uniqueItems: true,
        items: { type: 'string' }
      },
      conditions: {
        type: 'array',
        maxItems: 1024,
        uniqueItems: true,
        items: { type: 'object' }
      }
    }
  },
  roleSchema: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      priority: { type: 'number', minimum: 0, maximum: 9999 },
      resources: {
        type: 'object',
        patternProperties: {
          '^[a-zA-Z_$][0-9a-zA-Z_$]*$': {
            type: 'object',
            patternProperties: {
              '^[a-zA-Z_$][0-9a-zA-Z_$]*$': {
                type: 'object',
                properties: {
                  fields: {
                    type: 'array',
                    maxItems: 1024,
                    uniqueItems: true,
                    items: { type: 'string' }
                  },
                  conditions: {
                    type: 'array',
                    maxItems: 1024,
                    uniqueItems: true,
                    items: { type: 'object' }
                  }
                },
                required: ['fields'],
                additionalProperties: false
              },
            },
          },
        },
      },
    },
    required: ['name', 'priority', 'resources'],
    additionalProperties: false
  }
};
