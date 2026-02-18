import { motion } from 'framer-motion';

function HighlightedSource({ sourceText, typedText }) {
  return (
    <p className="source-content" aria-label="Source text">
      {sourceText.split('').map((char, index) => {
        let className = 'pending';
        if (typedText[index]) {
          className = typedText[index] === char ? 'correct' : 'wrong';
        }
        return (
          <span key={`${char}-${index}`} className={className}>
            {char}
          </span>
        );
      })}
    </p>
  );
}

export default function TextPanes({ sourceText, typedText, onInput, disabled }) {
  return (
    <motion.section
      className="panes"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <article className="panel source-panel">
        <h2>Source Paragraph</h2>
        <HighlightedSource sourceText={sourceText} typedText={typedText} />
      </article>

      <article className="panel typing-panel">
        <h2>Type Here</h2>
        <textarea
          value={typedText}
          onChange={(event) => onInput(event.target.value, event.nativeEvent?.inputType)}
          placeholder="Start typing the paragraph here..."
          disabled={disabled}
          className="typing-input"
        />
      </article>
    </motion.section>
  );
}
