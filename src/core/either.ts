export class Left<L, R>{
    constructor(readonly value: L) {}

    isRight() : this is Left<L, R> {
        return false
    }

    isLeft() : this is Left<L, R> {
        return true
    }
}

export const left = <L, R>(value : L) : Either<L, R> => {
    return new Left<L, null>(value);
}

export class Right<L, R> {
    constructor(readonly value: R) {}

    isRight() : this is Right<L, R>{
        return true
    }

    isLeft() : this is Right<L, R> {
        return false
    }
}

export const right = <L, R>(value: R) : Either<L, R> => {
    return new Right(value);
}

export type Either<L, R> = Left<L, R> | Right<L, R>