export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 500,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;

    await new Promise((res) => setTimeout(res, delay));

    return withRetry(fn, retries - 1, delay * 2);
  }
}
