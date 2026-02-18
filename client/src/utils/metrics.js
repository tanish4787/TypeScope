export function calculateLiveMetrics({
  sourceText,
  typedText,
  durationMs,
  backspaceCount,
}) {
  const durationMinutes = Math.max(durationMs / 60000, 1 / 60000);

  const totalTyped = typedText.length;

  let correctChars = 0;
  let incorrectChars = 0;

  for (let i = 0; i < totalTyped; i++) {
    const expected = sourceText[i] || "";
    const actual = typedText[i];

    if (actual === expected) {
      correctChars += 1;
    } else {
      incorrectChars += 1;
    }
  }

  const grossWpm = totalTyped / 5 / durationMinutes;

 
  const netWpm = Math.max(
    (correctChars - incorrectChars) / 5 / durationMinutes,
    0
  );

  const accuracy = totalTyped
    ? Math.max((correctChars / totalTyped) * 100, 0)
    : 0;

  return {
    grossWpm: Number(grossWpm.toFixed(1)),
    netWpm: Number(netWpm.toFixed(1)),
    accuracy: Number(accuracy.toFixed(1)),
    correctChars,
    incorrectChars,
    backspaceCount,
    totalTyped,
  };
}
