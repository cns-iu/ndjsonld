export async function* readLines(inputStream) {
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  for await (const chunk of inputStream) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      yield line;
    }
  }
  if (buffer.length > 0) {
    yield buffer;
  }
}
