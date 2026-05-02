/**
 * Returns an error string if the phrase looks like gibberish, or null if valid.
 * @param {string} phrase
 * @param {string} label - noun used in error messages (default: "Input")
 * @returns {string|null}
 * @example
 * const error = validPhrase(topic, 'Topic');
 * if (error) showAlert('Invalid Topic', error);
 */
export default function validPhrase(phrase, label = 'Input') {
  const t = (phrase ?? '').trim();
  if (t.length < 5) return `${label} is too short — try something more specific.`;
  if (!/[a-zA-Z]/.test(t)) return `${label} must contain letters.`;
  const letters = (t.match(/[a-zA-Z]/g) ?? []).length;
  const vowels = (t.match(/[aeiouAEIOU]/g) ?? []).length;
  if (vowels === 0) return `${label} doesn't look like a real subject.`;
  if (letters > 6 && vowels / letters < 0.1) return `${label} doesn't look like a real subject.`;
  if (/(.)\1{4,}/.test(t)) return `${label} contains too many repeated characters.`;
  return null;
}
