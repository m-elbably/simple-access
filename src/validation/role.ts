export const roleSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        resources: {
            type: "array",
            maxItems: 1024,
            uniqueItems: true,
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    actions: {
                        oneOf: [
                            {
                                type: "array",
                                minItems: 1,
                                maxItems: 1,
                                items: { const: "*" },
                            },
                            {
                                type: "array",
                                minItems: 1,
                                maxItems: 64,
                                uniqueItems: true,
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        attributes: {
                                            type: "array",
                                            minItems: 1,
                                            maxItems: 64,
                                            uniqueItems: true,
                                            items: { type: "string" },
                                        },
                                        scope: { type: "object" },
                                    },
                                    required: ["name", "attributes"],
                                    additionalProperties: false,
                                },
                            },
                        ],
                    },
                },
                required: ["name", "actions"],
                additionalProperties: false,
            },
        },
    },
    required: ["name", "resources"],
    additionalProperties: false,
};
