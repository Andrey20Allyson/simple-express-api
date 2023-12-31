export interface ITester<T> {
  test(value: T): boolean;
  getName(): string;
  getTestValue(): T;
}

export type TestFunction<T> = (value: T, testValue: T) => boolean;

export class Tester<T> implements ITester<T> {
  protected constructor(
    readonly name: string,
    readonly testCallBack: TestFunction<T>,
    readonly testValue: T,
  ) { }

  getTestValue(): T {
    return this.testValue;
  }

  getName(): string {
    return this.name;
  }

  test(value: T): boolean {
    return this.testCallBack(value, this.testValue);
  }

  static equals(value: unknown): ITester<unknown> {
    return new Tester('equals', (val1, val2) => val1 === val2, value);
  }

  static exists(): ITester<unknown> {
    return new Tester<unknown>('exists', (value) => value !== null && value !== undefined, null);
  }
}

export class NumberTester<T extends number = number> extends Tester<T> {
  static biggerThan(value: number): ITester<number> {
    return new NumberTester('bigger than', (value, testValue) => value > testValue, value);
  }
}

export class StringTester<T extends string = string> extends Tester<T> {
  private static includesCallBack: TestFunction<string> = (val1, val2) => val1.includes(val2);

  static includes(value: string): ITester<string> {
    return new StringTester('includes', StringTester.includesCallBack, value);
  }
}