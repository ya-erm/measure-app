const roundUp = (num: number, digits = 2): number => +num.toFixed(digits);

export class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public toVector(): Vector {
        const value = Math.sqrt(Math.pow(this.x, 2.0) + Math.pow(this.y, 2.0));
        const angle = Math.atan2(this.y, this.x);
        return new Vector(value, angle);
    }

    public scale(r: number): Point {
        return new Point(this.x * r, this.y * r);
    }

    public add(p: Point): Point {
        return new Point(this.x + p.x, this.y + p.y);
    }

    public sub(p: Point): Point {
        return new Point(this.x - p.x, this.y - p.y);
    }

    public eql(p: Point): boolean {
        return this.x === p.x && this.y === p.y;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }
}

export type CommandType =
    | 'M'
    | 'm'
    | 'L'
    | 'l'
    | 'C'
    | 'c'
    | 'Z'
    | 'H'
    | 'h'
    | 'V'
    | 'v'
    | 'A'
    | 'a'
    | 'Q'
    | 'q';
export type CommandObject = {
    type: CommandType;
    value: number[];
};

export const COMMAND_TYPE: { [name: string]: CommandType } = {
    MOVE: 'M', // M 0 0
    MOVE_RELATIVE: 'm', // m 0 0
    LINE: 'L', // L 1 1
    LINE_RELATIVE: 'l', // l 1 1
    CURVE: 'C', // C 1 1 2 2 3 3
    CURVE_RELATIVE: 'c', // c 1 1 2 2 3 3
    CLOSE: 'Z', // Z, z
    HORIZONTAL: 'H', // H 10
    HORIZONTAL_RELATIVE: 'h', // h 10
    VERTICAL: 'V', // V 20
    VERTICAL_RELATIVE: 'v', // v 20
    ARC_CURVE: 'A', // A 6 4 10 0 1 14 10
    ARC_CURVE_RELATIVE: 'a', // A 6 4 10 0 1 14 10
    QUADRATIC_CURVE: 'Q', // Q 10 60 10 30
    QUADRATIC_CURVE_RELATIVE: 'q', // q 10 60 10 30
} as const;

// TODO: compatible COMMAND_TYPE
export class Command {
    public type: CommandType;
    public value: number[];
    // TODO: Convert data format to number array.
    constructor(type: CommandType, value: number[] = []) {
        this.value = value;
        this.type = type;
    }

    public set cr(po: Point | undefined) {
        if (!po) return;
        if ((this.type !== 'C' && this.type !== 'c') || this.value.length !== 6) {
            return;
        }
        this.value.splice(2, 1, po.x);
        this.value.splice(3, 1, po.y);
    }
    public get cr(): Point | undefined {
        if ((this.type !== 'C' && this.type !== 'c') || this.value.length !== 6) {
            return undefined;
        }
        const [x, y] = this.value.slice(2, 4);
        return new Point(x, y);
    }
    public set cl(po: Point | undefined) {
        if (!po) return;
        if ((this.type !== 'C' && this.type !== 'c') || this.value.length !== 6) {
            return;
        }
        this.value.splice(0, 1, po.x);
        this.value.splice(1, 1, po.y);
    }
    public get cl(): Point | undefined {
        if ((this.type !== 'C' && this.type !== 'c') || this.value.length !== 6) {
            return undefined;
        }
        const [x, y] = this.value.slice(0, 2);
        return new Point(x, y);
    }

    public set point(po: Point | undefined) {
        if (!po) return;
        this.value.splice(this.value.length - 2, 1, po.x);
        this.value.splice(this.value.length - 1, 1, po.y);
    }
    public get point(): Point | undefined {
        const xy = this.value.slice(this.value.length - 2);
        return xy.length === 2 ? new Point(xy[0], xy[1]) : undefined;
    }

    public toString(): string {
        if (this.type === COMMAND_TYPE.CLOSE) return COMMAND_TYPE.CLOSE;
        return `${this.type} ${this.value.map((v) => roundUp(v)).join(' ')}`;
    }

    public scale(r: number): Command {
        const upd = new Command(
            this.type,
            this.value.map((p) => p * r),
        );
        return upd;
    }

    public clone(): Command {
        return new Command(this.type, this.value.slice());
    }
}

export class Vector {
    public angle: number;
    public value: number;
    constructor(v: number, a: number) {
        this.value = v;
        this.angle = a;
    }

    public toPoint(): Point {
        const x = Math.cos(this.angle) * this.value;
        const y = Math.sin(this.angle) * this.value;
        return new Point(x, y);
    }

    public scale(r: number): Vector {
        return new Vector(this.value * r, this.angle);
    }
}
