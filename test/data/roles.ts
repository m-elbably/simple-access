import { RESOURCES } from "./resources";
import { type Role } from "../../src";

export const ROLES = {
    ADMINISTRATOR: "administrator",
    OPERATION: "operation",
    SUPPORT: "support",
};

export const Roles: Role[] = [
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
                    { name: "create", attributes: ["*"] },
                    { name: "read", attributes: ["*"] },
                    { name: "update", attributes: ["*"] },
                ],
            },
            {
                name: RESOURCES.PRODUCT,
                actions: [
                    { name: "create", attributes: ["*", "active"] },
                    { name: "read", attributes: ["active"] },
                    { name: "update", attributes: ["*", "!history"] },
                    { name: "delete", attributes: ["*"] },
                ],
            },
            {
                name: RESOURCES.ORDER,
                actions: [
                    { name: "create", attributes: ["*"] },
                    { name: "read", attributes: ["*"] },
                    { name: "update", attributes: ["*"] },
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
                        name: "read",
                        attributes: ["*"],
                    },
                    { name: "update", attributes: ["status", "items"] },
                ],
            },
            {
                name: RESOURCES.ORDER,
                actions: [
                    {
                        name: "read",
                        attributes: ["*"],
                    },
                    { name: "create", attributes: ["*"] },
                    {
                        name: "update",
                        attributes: ["status", "items", "delivery"],
                    },
                ],
            },
            {
                name: RESOURCES.PRODUCT,
                actions: [
                    { name: "create", attributes: ["*", "active"] },
                    {
                        name: "read",
                        attributes: ["*", "!history"],
                        scope: {
                            valid: true,
                        },
                    },
                    {
                        name: "update",
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
                        name: "update",
                        attributes: ["*", "!password"],
                    },
                    {
                        name: "update",
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
            {
                name: RESOURCES.ORDER,
                actions: [
                    { name: "read", attributes: ["*"] },
                    { name: "update", attributes: ["status", "items"] },
                    {
                        name: "export",
                        attributes: ["*"],
                    },
                ],
            },
            {
                name: RESOURCES.PRODUCT,
                actions: [
                    {
                        name: "read",
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
