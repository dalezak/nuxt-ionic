/**
 * Returns an error string if the phrase looks like gibberish, or null if valid.
 * @param {string} phrase
 * @param {string} label - noun used in error messages (default: "Input")
 * @param {object} [options]
 * @param {number} [options.minLength=5] - minimum trimmed length to accept.
 * @param {boolean} [options.allowAcronyms=false] - when true, short all-caps /
 *   consonant-only strings (SQL, CSS, HTML) skip the vowel heuristics. Useful
 *   for subject/topic inputs where a downstream validator (e.g. an LLM) is the
 *   real gatekeeper and the client check only screens obvious gibberish.
 * @returns {string|null}
 * @example
 * const error = validPhrase(topic, 'Topic', { minLength: 2, allowAcronyms: true });
 * if (error) showAlert('Invalid Topic', error);
 */
export default function validPhrase(phrase, label = 'Input', options = {}) {
  const { minLength = 5, allowAcronyms = false } = options;
  const t = (phrase ?? '').trim();
  if (t.length < minLength) return `${label} is too short — try something more specific.`;
  if (!/[a-zA-Z]/.test(t)) return `${label} must contain letters.`;
  const letters = (t.match(/[a-zA-Z]/g) ?? []).length;
  const vowels = (t.match(/[aeiouAEIOU]/g) ?? []).length;
  // Short acronyms (≤5 letters) are usually legitimate subjects even with no
  // vowels — only skip the vowel checks for them when the caller opts in.
  const acronym = allowAcronyms && letters <= 5;
  if (!acronym) {
    if (vowels === 0) return `${label} doesn't look like a real subject.`;
    if (letters > 6 && vowels / letters < 0.1) return `${label} doesn't look like a real subject.`;
  }
  if (/(.)\1{4,}/.test(t)) return `${label} contains too many repeated characters.`;
  return null;
}
