export async function waitFor(callback: () => Promise<void>, timeout = 1000, interval = 100): Promise<void> {
  try {
    await callback();
  } catch (error) {
    await performWaitFor(callback, timeout, interval, 0, error as Error);
  }
}

async function performWaitFor(callback: () => Promise<void>, timeout: number, interval: number, timeWaited: number, error: Error): Promise<void> {
  if (timeWaited > timeout) {
    throw error ?? new Error("Was waiting for result but failed for unknown reason");
  }

  await setTimeoutAsync(async () => {
    try {
      return await callback();
    } catch (error) {
      await performWaitFor(callback, timeout, interval, timeWaited + interval, error as Error);
    }
  }, interval);
}

function setTimeoutAsync(callback: (args: void) => Promise<void>, waitForThisManyMilliseconds?: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        await callback();
        resolve();
      } catch (error) {
        reject(error);
      }
    }, waitForThisManyMilliseconds);
  });
}