function normalizeText(text) {
  return text.replace(/\r\n/g, '\n');
}

function getPunctuationChars(text) {
  return text.match(/[.,!?;:'"()\-]/g) || [];
}

function countErrors(source, typed) {
  const maxLength = Math.max(source.length, typed.length);
  let errors = 0;
  for (let i = 0; i < maxLength; i += 1) {
    if ((source[i] || '') !== (typed[i] || '')) {
      errors += 1;
    }
  }
  return errors;
}

function charAccuracy(source, typed) {
  if (!source.length) return 0;
  const errors = countErrors(source, typed);
  return Math.max(0, ((source.length - errors) / source.length) * 100);
}

function punctuationAccuracy(source, typed) {
  const srcPunct = getPunctuationChars(source);
  if (!srcPunct.length) return 100;

  const typedPunct = getPunctuationChars(typed);
  let correct = 0;
  for (let i = 0; i < srcPunct.length; i += 1) {
    if (srcPunct[i] === typedPunct[i]) correct += 1;
  }
  return (correct / srcPunct.length) * 100;
}

function wpm(chars, durationMs) {
  if (!durationMs) return 0;
  const minutes = durationMs / 60000;
  return chars / 5 / minutes;
}

function buildFeedback(metrics) {
  const strengths = [];
  const improvements = [];

  if (metrics.accuracy >= 95) strengths.push('Excellent character-level accuracy.');
  else improvements.push('Focus on reducing substitution errors by typing slightly slower.');

  if (metrics.punctuationAccuracy >= 90) strengths.push('Strong punctuation control and symbol awareness.');
  else improvements.push('Practice punctuation-heavy paragraphs to improve symbol precision.');

  if (metrics.netWpm >= 45) strengths.push('Solid net speed for productive writing workflows.');
  else improvements.push('Use 2-minute sprint drills to improve rhythm and speed consistency.');

  return {
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    drills: [
      'Timed 3-minute paragraph repetition with strict punctuation.',
      'Capitalization and sentence-boundary correction drills.',
      'Daily 10-minute warm-up focusing on minimal backspace usage.'
    ],
    summary:
      'Maintain a balance of speed and precision. Small daily sessions with focused correction can drive sustained improvement.'
  };
}

export function analyzeSession({ sourceText, typedText, durationMs, backspaceCount = 0 }) {
  const source = normalizeText(sourceText || '');
  const typed = normalizeText(typedText || '');

  const rawWpm = wpm(typed.length, durationMs);
  const errorCount = countErrors(source, typed);
  const penaltyChars = errorCount;
  const netWpm = wpm(Math.max(typed.length - penaltyChars, 0), durationMs);
  const cpm = durationMs ? typed.length / (durationMs / 60000) : 0;
  const accuracy = charAccuracy(source, typed);
  const punctAccuracy = punctuationAccuracy(source, typed);

  const metrics = {
    rawWpm: Number(rawWpm.toFixed(2)),
    netWpm: Number(netWpm.toFixed(2)),
    cpm: Number(cpm.toFixed(2)),
    accuracy: Number(accuracy.toFixed(2)),
    punctuationAccuracy: Number(punctAccuracy.toFixed(2)),
    errorCount,
    backspaceCount
  };

  return {
    metrics,
    aiFeedback: buildFeedback(metrics)
  };
}
