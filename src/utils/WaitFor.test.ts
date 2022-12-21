import * as target from "./WaitFor";

const callbackMock = jest.fn();

it("should not throw error if first implementation passes", async () => {
  callbackMock
    .mockImplementationOnce(() => {
      // Success
    });

  await target.waitFor(callbackMock, 0, 1);
});

it("should not throw if second implementation is successful", async () => {
  callbackMock
    .mockImplementationOnce(() => {
      throw new Error("First");
    })
    .mockImplementationOnce(() => {
      // Success
    });

  await target.waitFor(callbackMock, 0, 1);
});

it("should not throw if third implementation is successful without enough timeout", async () => {
  callbackMock
    .mockImplementationOnce(() => {
      throw new Error("First");
    })
    .mockImplementationOnce(() => {
      throw new Error("Second");
    })
    .mockImplementationOnce(() => {
      // Success
    });

  await target.waitFor(callbackMock, 2, 1);
});

it("should throw error if first implementation never passes", async () => {
  callbackMock
    .mockImplementation(() => {
      throw new Error("Never successful");
    });

  const promise = target.waitFor(callbackMock, 0, 1);

  await expect(promise).rejects.toEqual(new Error("Never successful"));
});

it("should throw error if timeout runs out", async () => {
  callbackMock
    .mockImplementation(() => {
      throw new Error("Should time out");
    });

  const promise = target.waitFor(callbackMock, 5, 1);

  await expect(promise).rejects.toEqual(new Error("Should time out"));
});

it("should throw default error if no error provided", async () => {
  callbackMock
    .mockImplementation(() => {
      throw undefined;
    });

  const promise = target.waitFor(callbackMock, 0, 1);

  await expect(promise).rejects.toEqual(new Error("Was waiting for result but failed for unknown reason"));
});
