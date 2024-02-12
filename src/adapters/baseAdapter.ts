import { Role } from "../types";

export abstract class BaseAdapter<
    RT extends Array<Role> | Promise<Array<Role>>
> {
    protected constructor(public name: string) {}

    abstract getRolesByName(names: Array<string>): RT;
}
