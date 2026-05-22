// Pluralize a word based on a count, via the `pluralize` npm package.
// Sits in the `text-*` util family alongside `textDate`, `textRelative`,
// `textTruncate`, etc. Handles irregular English plurals out of the box
// (`entry → entries`, `person → people`, `analysis → analyses`,
// `child → children`) plus all the regular cases.
//
//   textPluralize('insight', 1)        // → 'insight'
//   textPluralize('insight', 2)        // → 'insights'
//   textPluralize('entry', 5)          // → 'entries'
//   textPluralize('person', 2, true)   // → '2 people'  (inclusive mode)
//
// Replaces the `count === 1 ? 'noun' : 'nouns'` ternary that recurs across
// pages — same conciseness, correct on irregular forms.

import pluralize from 'pluralize';
export default pluralize;
