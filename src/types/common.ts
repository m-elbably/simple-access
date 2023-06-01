export interface Tuple {
    [key: string]: any;
}

type ArrayLengthMutationKeys =
    | "splice"
    | "push"
    | "pop"
    | "shift"
    | "unshift"
    | number;
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems>
    ? TItems
    : never;
export type FixedLengthArray<T extends any[]> = Pick<
    T,
    Exclude<keyof T, ArrayLengthMutationKeys>
> & { [Symbol.iterator]: () => IterableIterator<ArrayItems<T>> };

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
    actions: Array<Action> | FixedLengthArray<["*"]>;
}

export interface Action {
    name: string;
    attributes?: Array<string>;
    scope?: Tuple;
}
