import { expect } from "chai";
import { before, describe, it } from "mocha";
import { SimpleAccess, MemoryAdapter, ErrorEx } from "../../src";
import { RoleDefinition, Roles } from "../data";

let adapter: MemoryAdapter<RoleDefinition>;
let acl: SimpleAccess<RoleDefinition, typeof adapter>;

before(() => {
    adapter = new MemoryAdapter(Roles);
    acl = new SimpleAccess(adapter);
});

describe("Memory adapter functionalities", () => {
    it("Should return error when passing invalid roles array", async () => {
        try {
            const mAdapter = new MemoryAdapter(undefined);
            const accessControl = new SimpleAccess(adapter);
        } catch (e) {
            expect(e)
                .to.be.instanceOf(Error)
                .with.property("name")
                .to.be.equal(ErrorEx.VALIDATION_ERROR);
        }
    });

    it("Should create a new MemoryAdapter instance", async () => {
        expect(adapter).to.be.an("object").to.an.instanceof(MemoryAdapter);
    });

    it("Should create a new SimpleAccess instance", async () => {
        expect(acl).to.be.an("object").to.an.instanceof(SimpleAccess);
    });

    it("Should return empty array because role(s) does not exists", async () => {
        // @ts-ignore: Unreachable code error
        const result = adapter.getRolesByName(["none"]);
        expect(result).to.be.an("array").with.lengthOf(0);
    });

    it('Should return validation error when calling "getRolesByName" with invalid roles', async () => {
        try {
            const result = adapter.getRolesByName(undefined);
        } catch (e) {
            expect(e)
                .to.be.instanceOf(Error)
                .with.property("name")
                .to.be.equal(ErrorEx.VALIDATION_ERROR);
        }
    });

    it('Should return array of roles when calling "getRolesByName"', async () => {
        const result = adapter.getRolesByName(["administrator", "operation"]);
        expect(result).to.be.an("array").with.lengthOf(2);
    });

    it('Should return array of roles when calling "getRoles"', async () => {
        const result = adapter.getRoles();
        expect(result).to.be.an("array").with.lengthOf(3);
    });
});
