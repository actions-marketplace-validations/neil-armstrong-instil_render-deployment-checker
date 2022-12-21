export function apiToken(): string {
  const fromEnvironment = process.env.RENDER_APIKEY;
  if (!fromEnvironment) throw new Error("Could not get render api key");

  return fromEnvironment;
}
