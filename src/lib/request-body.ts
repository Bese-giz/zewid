import "server-only";

export class BodyTooLargeError extends Error {}

export async function readLimitedBody(request: Request, maximumBytes: number): Promise<string> {
  const length = Number(request.headers.get("content-length"));
  if (Number.isFinite(length) && length > maximumBytes) throw new BodyTooLargeError("Request body is too large.");
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maximumBytes) {
        await reader.cancel();
        throw new BodyTooLargeError("Request body is too large.");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return new TextDecoder().decode(Buffer.concat(chunks));
}
