import { expect } from "vitest";
import { IResponse } from "../resources/base/response";
import { handleError } from "./error-hander";
import { ResponseMock } from "./response.mock";
import { ITester } from "./tester";

export type EndPointRunCallback<T extends object> = (resp: IResponse<T>) => Promise<void>;

export type ResponseTestCallback<T extends object> = (resp: ResponseMock<T>) => Promise<void> | void;

export type Keytype = keyof any;

function keyToString(key: Keytype) {
  switch (typeof key) {
    case "string":
    case "number":
      return JSON.stringify(key);
    case "symbol":
      return key.toString();
  }
}

export class ResponseAsserter<T extends object> {
  private _tests: ResponseTestCallback<T>[] = [];
  private _result!: Promise<void>;

  private constructor() { }

  static from<T extends object>(callback: EndPointRunCallback<T>): ResponseAsserter<T> {
    const resp = ResponseMock.create<T>();

    const respPromise = callback(resp)
      .catch(handleError(resp))

    const asserter = new this<T>();

    asserter._result = respPromise.then(() => asserter.exec(resp));

    return asserter;
  }

  test(test: ResponseTestCallback<T>) {
    return this._tests.push(test);
  }

  expectStatus(code: number) {
    this.test(resp => expect(resp.getStatus()).toBe(code));

    return this;
  }

  expectBody(path: Keytype | Keytype[], tester: ITester<unknown>) {
    this.test(resp => {
      let val: unknown = resp.getBody();
      const pathArr = path instanceof Array ? path : [path];

      for (const key of pathArr) {
        if (typeof val !== 'object') expect.fail(`Can't get '${keyToString(key)}' from a non object value`);
        if (val === null) expect.fail(`Can't get '${keyToString(key)}' from null`);

        val = val[key as keyof {}];
      }

      if (tester.test(val) === false) {
        expect.fail(`[Property Test Fail]\n  Expected value: ${tester.getTestValue()}\n  Property value: ${val}\n  Property path: [${pathArr.map(key => keyToString(key)).join(', ')}]`);
      }
    });

    return this;
  }

  private async exec(resp: ResponseMock<T>): Promise<void> {
    for (const test of this._tests) {
      await test(resp);
    }

    this._tests = [];
  }

  async result(): Promise<void> {
    await this._result;
  }
}

