import safeJsonStringify from 'safe-json-stringify'
export function serializeDoc (doc) {
  const stringifiedData = safeJsonStringify(doc);
  const data = JSON.parse(stringifiedData);
  return data
}