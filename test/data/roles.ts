import { RESOURCES } from "./resources";
import { ACTIONS } from "./actions";
import { Role } from "../../src";

export enum ROLES {
    ADMINISTRATOR = "administrator",
    OPERATION = "operation",
    SUPPORT = "support",
}

export type RoleDefinition = [`${ROLES}`, `${RESOURCES}`, `${ACTIONS}`];

export const Roles: Role<RoleDefinition>[] = [
    {
        name: ROLES.ADMINISTRATOR,
        resources: [
            {
                name: RESOURCES.CONFIGURATION,
                actions: ["*"],
            },
            {
                name: RESOURCES.FILE,
                actions: ["*"],
            },
            {
                name: RESOURCES.USER,
                actions: [
                    { name: ACTIONS.CREATE, attributes: ["*"] },
                    { name: ACTIONS.READ, attributes: ["*"] },
                    { name: ACTIONS.UPDATE, attributes: ["*"] },
                ],
            },
            {
                name: RESOURCES.PRODUCT,
                actions: [
                    { name: ACTIONS.CREATE, attributes: ["*", "active"] },
                    { name: ACTIONS.READ, attributes: ["active"] },
                    { name: ACTIONS.UPDATE, attributes: ["*", "!history"] },
                    { name: ACTIONS.DELETE, attributes: ["*"] },
                ],
            },
            {
                name: RESOURCES.ORDER,
                actions: [
                    { name: ACTIONS.CREATE, attributes: ["*"] },
                    { name: ACTIONS.READ, attributes: ["*"] },
                    { name: ACTIONS.UPDATE, attributes: ["*"] },
                ],
            },
        ],
    },
    {
        name: ROLES.OPERATION,
        resources: [
            {
                name: RESOURCES.CONFIGURATION,
                actions: [
                    {
                        name: ACTIONS.READ,
                        attributes: ["*"],
                    },
                    { name: ACTIONS.UPDATE, attributes: ["status", "items"] },
                ],
            },
            {
                name: RESOURCES.ORDER,
                actions: [
                    {
                        name: ACTIONS.READ,
                        attributes: ["*"],
                    },
                    { name: ACTIONS.CREATE, attributes: ["*"] },
                    {
                        name: ACTIONS.UPDATE,
                        attributes: ["status", "items", "delivery"],
                    },
                ],
            },
            {
                name: RESOURCES.PRODUCT,
                actions: [
                    { name: ACTIONS.CREATE, attributes: ["*", "active"] },
                    {
                        name: ACTIONS.READ,
                        attributes: ["*", "!history"],
                        scope: {
                            valid: true,
                        },
                    },
                    {
                        name: ACTIONS.UPDATE,
                        attributes: ["*", "!history", "!active"],
                    },
                ],
            },
        ],
    },
    {
        name: ROLES.SUPPORT,
        resources: [
            {
                name: RESOURCES.USER,
                actions: [
                    {
                        name: ACTIONS.UPDATE,
                        attributes: ["*", "!password"],
                    },
                    {
                        name: ACTIONS.UPDATE,
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
            {
                name: RESOURCES.ORDER,
                actions: [
                    { name: ACTIONS.READ, attributes: ["*"] },
                    { name: ACTIONS.UPDATE, attributes: ["status", "items"] },
                    {
                        name: ACTIONS.EXPORT,
                        attributes: ["*"],
                    },
                ],
            },
            {
                name: RESOURCES.PRODUCT,
                actions: [
                    {
                        name: ACTIONS.READ,
                        attributes: ["*", "!isActive"],
                        scope: {
                            namespace: "*.merchant.products",
                            products: [1, 229, 3394],
                        },
                    },
                ],
            },
        ],
    },
];
