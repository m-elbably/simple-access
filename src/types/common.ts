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

export interface Role<R extends [string, string, string]> {
    name: R[0];
    resources: Array<Resource<R[1], R[2]>>;
}

export interface Resource<ResourceNamesT = string, ActionNamesT = string> {
    name: ResourceNamesT;
    actions: Array<Action<ActionNamesT>> | FixedLengthArray<["*"]>;
}

export interface Action<ActionNamesT = string> {
    name: ActionNamesT;
    attributes?: Array<string>;
    scope?: Tuple;
}

export type TypeOfClassMethod<T, M extends keyof T> = T[M] extends (
    ...args: any
) => any
    ? T[M]
    : never;

export type TypeOfClassMethodReturn<T, M extends keyof T> = T[M] extends (
    ...args: any
) => any
    ? ReturnType<T[M]>
    : never;
