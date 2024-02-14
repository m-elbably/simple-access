import { expect } from "chai";
import { before, describe, it } from "mocha";
import { ErrorEx, Permission } from "../../src";
import { RoleDefinition, Roles, ROLES, RESOURCES, PRODUCTS } from "../data";
import { SimpleAccess, MemoryAdapter } from "../../src";

let adapter: MemoryAdapter<RoleDefinition>;
let acl: SimpleAccess<RoleDefinition, typeof adapter>;

before(() => {
    adapter = new MemoryAdapter(Roles);
    acl = new SimpleAccess(adapter);
});

describe("Test core functionalities", () => {
    it("Should return validation error, for invalid adapter", async () => {
        try {
            new SimpleAccess(undefined);
        } catch (e) {
            expect(e)
                .to.be.instanceOf(Error)
                .with.property("name")
                .to.be.equal(ErrorEx.VALIDATION_ERROR);
        }
    });

    it("Should return validation error, for invalid roles schema", async () => {
        const simpleAccess = new SimpleAccess(
            new MemoryAdapter([
                {
                    name: "support",
                    resources: [
                        {
                            name: "product",
                            actions: [
                                {
                                    name: "read",
                                    attributes: ["*"],
                                },
                            ],
                        },
                    ],
                },
            ])
        );

        try {
            simpleAccess.can([ROLES.SUPPORT], "ready", RESOURCES.PRODUCT);
        } catch (e) {
            expect(e)
                .to.be.instanceOf(Error)
                .with.property("name")
                .to.be.equal(ErrorEx.VALIDATION_ERROR);
        }
    });

    it("Should return validation error, for missing role", async () => {
        const ROLE_NAME = "finance";
        try {
            // @ts-ignore: Unreachable code error
            acl.can(ROLE_NAME, "create", "product");
        } catch (e) {
            expect(e)
                .to.be.instanceOf(Error)
                .with.property("name")
                .to.be.equal(ErrorEx.VALIDATION_ERROR);

            expect(e)
                .to.be.instanceOf(Error)
                .with.property("message")
                .to.contains(ROLE_NAME);
        }
    });

    it("Should return validation error object, if role is invalid", async () => {
        try {
            acl.can(undefined, "read", "product");
        } catch (e) {
            expect(e)
                .to.be.instanceOf(Error)
                .with.property("name")
                .to.be.equal(ErrorEx.VALIDATION_ERROR);
        }
    });

    it("Should return validation error object, if one or more roles are invalid", async () => {
        try {
            acl.can([ROLES.ADMINISTRATOR, undefined], "read", "product");
        } catch (e) {
            expect(e)
                .to.be.instanceOf(Error)
                .with.property("name")
                .to.be.equal(ErrorEx.VALIDATION_ERROR);
        }
    });

    it("Should return validation error object, if one or more roles are missing", async () => {
        try {
            // @ts-ignore: Unreachable code error
            acl.can([ROLES.ADMINISTRATOR, "auditor"], "read", "product");
        } catch (e) {
            expect(e)
                .to.be.instanceOf(Error)
                .with.property("name")
                .to.be.equal(ErrorEx.VALIDATION_ERROR);
        }
    });
});

describe("Test permission object", () => {
    let permission: Permission = undefined;
    const ROLE_NAME = ROLES.SUPPORT;
    const ACTION_NAME = "update";
    const RESOURCE_NAME = RESOURCES.ORDER;

    before(async () => {
        permission = acl.can(ROLE_NAME, ACTION_NAME, RESOURCE_NAME);
    });

    it("Should return permission object", async () => {
        expect(permission).to.be.an("object");
    });

    it("Should return permission object with granted attribute", async () => {
        const { granted } = permission;
        expect(granted).to.be.a("boolean").to.be.equal(true);
    });

    it("Should return permission object with access object", async () => {
        const { access } = permission;
        const { action, resource, roles } = access;

        expect(action).to.be.equal(ACTION_NAME);

        expect(resource).to.be.equal(RESOURCE_NAME);

        expect(roles).to.be.an("array").to.be.eql([ROLE_NAME]);
    });

    it("Should return permission object with subject grants", async () => {
        const { grants } = permission;
        expect(grants)
            .to.be.an("object")
            .with.keys([RESOURCES.USER, RESOURCES.ORDER, RESOURCES.PRODUCT]);
    });

    it("Should return permission object with attributes array", async () => {
        const { attributes } = permission;
        expect(attributes).to.be.an("array").to.be.eql(["status", "items"]);
    });

    it("Should return permission object with scope object", async () => {
        const { scope } = permission;
        expect(scope).to.be.an("object").and.to.be.eql({});
    });
});

describe("Test can functionality with single role", () => {
    it("Should return permission with granted equal false when resource does not exist", async () => {
        // @ts-ignore: Unreachable code error
        const permission = acl.can([ROLES.OPERATION], "delete", "languages");
        const { granted } = permission;
        expect(granted).to.be.equal(false);
    });

    it("Should return permission with granted equal false when action is not allowed", async () => {
        const permission = acl.can([ROLES.OPERATION], "delete", RESOURCES.FILE);
        const { granted } = permission;
        expect(granted).to.be.equal(false);
    });

    it("Should return permission with granted equal true when action is allowed on resource", async () => {
        const permission = acl.can([ROLES.OPERATION], "read", RESOURCES.ORDER);
        const { granted } = permission;
        expect(granted).to.be.equal(true);
    });

    it("Should return permission with granted equal true when subject has access to all actions on resource", async () => {
        const permission = acl.can(
            [ROLES.ADMINISTRATOR],
            // @ts-ignore: Unreachable code error
            "readAll",
            RESOURCES.FILE
        );
        const { granted } = permission;
        expect(granted).to.be.equal(true);
    });
});

describe("Test can functionality with overlapped roles - permission access", () => {
    let permission: Permission;
    const ROLE_NAME = [ROLES.ADMINISTRATOR, ROLES.OPERATION];
    const ACTION_NAME = "read";
    const RESOURCE_NAME = RESOURCES.PRODUCT;

    before(async () => {
        permission = acl.can(ROLE_NAME, ACTION_NAME, RESOURCE_NAME);
    });

    it("Should return permission object with granted equal true", async () => {
        const { granted } = permission;
        expect(granted).to.be.equal(true);
    });

    it("Should return permission object with valid access object", async () => {
        const { access } = permission;
        const { action, resource, roles } = access;

        expect(action).to.be.equal(ACTION_NAME);
        expect(resource).to.be.equal(RESOURCE_NAME);
        expect(roles).to.be.an("array").to.be.eql(ROLE_NAME);
    });
});

describe("Test can functionality with overlapped roles - resources", () => {
    let permission: Permission;
    const ROLE_NAME = [ROLES.ADMINISTRATOR, ROLES.OPERATION];
    const ACTION_NAME = "read";
    const RESOURCE_NAME = RESOURCES.PRODUCT;

    before(async () => {
        permission = acl.can(ROLE_NAME, ACTION_NAME, RESOURCE_NAME);
    });

    it("Should return permission object with merged (union) resources", async () => {
        const { grants } = permission;
        const resources: { [k: string]: any } = {};
        const roles = acl.adapter.getRolesByName(ROLE_NAME);

        roles.forEach((role) => {
            role.resources.forEach((resource) => {
                resources[resource.name] = resource;
            });
        });

        expect(grants).to.be.an("object").with.all.keys(Object.keys(resources));
    });
});

describe("Test can functionality with overlapped roles - actions", () => {
    it("Should return permission object with merged (union) actions inside resource", async () => {
        const ROLE_NAME = [ROLES.ADMINISTRATOR, ROLES.OPERATION];
        const RESOURCE_NAME = RESOURCES.PRODUCT;
        const permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.OPERATION],
            "read",
            RESOURCES.PRODUCT
        );

        const {
            grants: { [RESOURCE_NAME]: gResource },
        } = permission;
        const roles = acl.adapter.getRolesByName(ROLE_NAME);
        const actions: { [k: string]: any } = {};

        roles.forEach((role) => {
            role.resources.forEach((resource) => {
                if (resource.name === RESOURCE_NAME) {
                    resource.actions.forEach((action) => {
                        if (typeof action === "object") {
                            actions[action.name] = action;
                        }
                    });
                }
            });
        });

        expect(gResource)
            .to.be.an("object")
            .with.all.keys(Object.keys(actions));
    });

    it("Should return permission object with the most permissive action applied", async () => {
        const permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.OPERATION],
            "read",
            RESOURCES.CONFIGURATION
        );

        const { granted, grants } = permission;
        const { [RESOURCES.CONFIGURATION]: resource } = grants;

        expect(granted).to.be.equal(true);

        expect(resource).to.be.equal("*");
    });

    it("Should return permission object with the most permissive action applied and granted access to custom action", async () => {
        const permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.OPERATION],
            // @ts-ignore: Unreachable code error
            "print",
            RESOURCES.CONFIGURATION
        );

        const { granted, grants } = permission;
        const { [RESOURCES.CONFIGURATION]: resource } = grants;

        expect(granted).to.be.equal(true);

        expect(resource).to.be.equal("*");
    });
});

describe("Test can functionality with overlapped roles - attributes", () => {
    it("Should return permission object with all allowed attributes in action - all attributes", async () => {
        const ACTION_NAME = "read";
        const RESOURCE_NAME = RESOURCES.PRODUCT;
        const RESULT = ["*", "!history"];
        const permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.OPERATION],
            ACTION_NAME,
            RESOURCE_NAME
        );

        const {
            grants: { [RESOURCE_NAME]: resource },
        } = permission;
        expect(resource)
            .to.be.an("object")
            .with.ownProperty(ACTION_NAME)
            .with.ownProperty("attributes")
            .to.be.an("array")
            .eql(RESULT);

        expect(permission)
            .to.be.an("object")
            .with.property("attributes")
            .to.be.an("array")
            .eql(RESULT);
    });

    it("Should return permission object with all allowed attributes in action - filtered all attributes", async () => {
        const ACTION_NAME = "create";
        const RESOURCE_NAME = RESOURCES.PRODUCT;
        const permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.OPERATION],
            ACTION_NAME,
            RESOURCE_NAME
        );

        const {
            grants: { [RESOURCE_NAME]: resource },
        } = permission;
        expect(resource)
            .to.be.an("object")
            .with.ownProperty(ACTION_NAME)
            .with.ownProperty("attributes")
            .to.be.an("array")
            .eql(["*"]);

        expect(permission)
            .to.be.an("object")
            .with.property("attributes")
            .to.be.an("array")
            .eql(["*"]);
    });

    it("Should return permission object with all allowed attributes in action - projected attributes", async () => {
        const ACTION_NAME = "update";
        const RESOURCE_NAME = RESOURCES.ORDER;
        const RESULT = ["status", "items", "delivery"];
        const permission = acl.can(
            [ROLES.OPERATION, ROLES.SUPPORT],
            ACTION_NAME,
            RESOURCE_NAME
        );

        const {
            grants: { [RESOURCE_NAME]: resource },
        } = permission;
        expect(resource)
            .to.be.an("object")
            .with.ownProperty(ACTION_NAME)
            .with.ownProperty("attributes")
            .to.be.an("array")
            .eql(RESULT);

        expect(permission)
            .to.be.an("object")
            .with.property("attributes")
            .to.be.an("array")
            .eql(RESULT);
    });

    it("Should return permission object with all allowed attributes in action - mixed attributes", async () => {
        const ACTION_NAME = "read";
        const RESOURCE_NAME = RESOURCES.PRODUCT;
        const RESULT = ["*", "!history"];
        const permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.OPERATION],
            ACTION_NAME,
            RESOURCE_NAME
        );

        const {
            grants: { [RESOURCE_NAME]: resource },
        } = permission;
        expect(resource)
            .to.be.an("object")
            .with.ownProperty(ACTION_NAME)
            .with.ownProperty("attributes")
            .to.be.an("array")
            .eql(RESULT);

        expect(permission)
            .to.be.an("object")
            .with.property("attributes")
            .to.be.an("array")
            .eql(RESULT);
    });

    it("Should return permission object with all allowed attributes in action - negated attributes", async () => {
        const ACTION_NAME = "update";
        const RESOURCE_NAME = RESOURCES.PRODUCT;
        const RESULT = ["*", "!history"];
        const permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.OPERATION],
            ACTION_NAME,
            RESOURCE_NAME
        );

        const {
            grants: { [RESOURCE_NAME]: resource },
        } = permission;
        expect(resource)
            .to.be.an("object")
            .with.ownProperty(ACTION_NAME)
            .with.ownProperty("attributes")
            .to.be.an("array")
            .eql(RESULT);

        expect(permission)
            .to.be.an("object")
            .with.property("attributes")
            .to.be.an("array")
            .eql(RESULT);
    });
});

describe("Test can functionality with overlapped roles - scope", () => {
    it("Should return permission object with the most permissive scope applied", async () => {
        const ACTION_NAME = "read";
        const RESOURCE_NAME = RESOURCES.PRODUCT;
        const permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.OPERATION],
            ACTION_NAME,
            RESOURCE_NAME
        );

        const {
            grants: { [RESOURCE_NAME]: resource },
        } = permission;
        expect(resource)
            .to.be.an("object")
            .with.ownProperty(ACTION_NAME)
            .with.ownProperty("scope")
            .to.be.an("object")
            .eql({});

        expect(permission)
            .to.be.an("object")
            .with.property("scope")
            .to.be.an("object")
            .eql({});
    });

    it("Should return permission object with all scopes merged", async () => {
        const ROLE_NAME = [ROLES.OPERATION, ROLES.SUPPORT];
        const ACTION_NAME = "read";
        const RESOURCE_NAME = RESOURCES.PRODUCT;
        const permission = acl.can(ROLE_NAME, ACTION_NAME, RESOURCE_NAME);

        const {
            grants: { [RESOURCE_NAME]: resource },
        } = permission;
        const roles = acl.adapter.getRolesByName(ROLE_NAME);
        const scope: any = {};

        roles.forEach((role) => {
            role.resources.forEach((resource) => {
                if (resource.name === RESOURCE_NAME) {
                    resource.actions.forEach((action) => {
                        if (
                            typeof action === "object" &&
                            action.name === ACTION_NAME &&
                            action.scope != null
                        ) {
                            Object.entries(action.scope).forEach(([k, v]) => {
                                scope[k] = v;
                            });
                        }
                    });
                }
            });
        });

        expect(resource)
            .to.be.an("object")
            .with.ownProperty(ACTION_NAME)
            .with.ownProperty("scope")
            .to.be.an("object")
            .eql(scope);

        expect(permission)
            .to.be.an("object")
            .with.property("scope")
            .to.be.an("object")
            .eql(scope);
    });
});

describe("Test data filtration base on permission", () => {
    let permission: Permission;

    before(async () => {
        permission = acl.can([ROLES.SUPPORT], "read", RESOURCES.PRODUCT);
    });

    it("Should return true if user can read provided resource", async () => {
        const resource = acl.filter(permission, PRODUCTS[0]);

        expect(resource).to.be.an("object").to.have.ownProperty("authorId");
        expect(resource).to.be.an("object").to.not.have.ownProperty("isActive");
    });
});

describe("Test permission bounded functionalities", () => {
    let permission: Permission;

    before(async () => {
        permission = acl.can(
            [ROLES.ADMINISTRATOR, ROLES.SUPPORT],
            "read",
            RESOURCES.PRODUCT
        );
    });

    it("Should return same data object when filtering if data is null", async () => {
        const resource = permission.filter(null);

        expect(resource).to.be.equal(null);
    });

    it("Should filter provided resource according to role allowed attributes", async () => {
        const resource = permission.filter(PRODUCTS[0]);

        expect(resource).to.be.an("object").to.have.ownProperty("authorId");
        expect(resource).to.be.an("object").to.not.have.ownProperty("isActive");
    });
});
