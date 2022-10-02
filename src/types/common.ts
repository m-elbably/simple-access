export interface Tuple {
    [key: string]: any;
}

export class ErrorEx extends Error {
    static VALIDATION_ERROR: "VALIDATION_ERROR";

    constructor(name: string, message: string) {
        super(message);
        this.name = name;
    }
}

export interface Role {
    name: string;
    resources: Array<Resource>;
}

export interface Resource {
    name: string;
    actions: Array<Action>;
}

export interface Action {
    name: string;
    attributes?: Array<string>;
    conditions?: Array<string>;
    scope?: {
        [k: string]: Tuple;
    };
}
