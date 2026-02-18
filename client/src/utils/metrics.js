export function calculateLiveMetrics({ sourceText, typedText, durationMs, backspaceCount }) {
  const durationMinutes = Math.max(durationMs / 60000, 1 / 60000);
  const rawWpm = typedText.length / 5 / durationMinutes;

  let errors = 0;
  for (let i = 0; i < Math.max(sourceText.length, typedText.length); i += 1) {
    if ((sourceText[i] || '') !== (typedText[i] || '')) errors += 1;
  }

  const netWpm = Math.max((typedText.length - errors) / 5 / durationMinutes, 0);
  const accuracy = sourceText.length
    ? Math.max(((sourceText.length - errors) / sourceText.length) * 100, 0)
    : 0;

  return {
    rawWpm: Number(rawWpm.toFixed(1)),
    netWpm: Number(netWpm.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
    errors,
    backspaceCount
  };
}
