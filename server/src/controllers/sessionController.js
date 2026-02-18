import crypto from 'node:crypto';
import { Session } from '../models/Session.js';
import { analyzeSession } from '../utils/analyzer.js';

let hasDb = false;

export function setDbAvailability(value) {
  hasDb = Boolean(value);
}

const inMemorySessions = new Map();

function getRecord(id) {
  if (hasDb) return Session.findById(id);
  return inMemorySessions.get(id) || null;
}

export async function createSession(req, res) {
  const { sourceText } = req.body;
  if (!sourceText || sourceText.trim().length < 20) {
    return res.status(400).json({ message: 'Please provide at least 20 characters of source text.' });
  }

  if (hasDb) {
    const session = await Session.create({ sourceText });
    return res.status(201).json({ sessionId: session.id, sourceText: session.sourceText });
  }

  const id = crypto.randomUUID();
  const record = { id, sourceText, typedText: '', durationMs: 0, metrics: null, aiFeedback: null, createdAt: new Date() };
  inMemorySessions.set(id, record);
  return res.status(201).json({ sessionId: id, sourceText });
}

export async function finishSession(req, res) {
  const { id } = req.params;
  const { typedText, durationMs, backspaceCount } = req.body;

  const session = await getRecord(id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found.' });
  }

  const sourceText = hasDb ? session.sourceText : session.sourceText;
  const result = analyzeSession({ sourceText, typedText, durationMs, backspaceCount });

  if (hasDb) {
    session.typedText = typedText;
    session.durationMs = durationMs;
    session.metrics = result.metrics;
    session.aiFeedback = result.aiFeedback;
    await session.save();
  } else {
    inMemorySessions.set(id, {
      ...session,
      typedText,
      durationMs,
      metrics: result.metrics,
      aiFeedback: result.aiFeedback
    });
  }

  return res.json({ sessionId: id, ...result });
}

export async function getSession(req, res) {
  const { id } = req.params;
  const session = await getRecord(id);
  if (!session) {
    return res.status(404).json({ message: 'Session not found.' });
  }

  if (hasDb) {
    return res.json(session);
  }

  return res.json(session);
}

export async function listSessions(_req, res) {
  if (hasDb) {
    const sessions = await Session.find().sort({ createdAt: -1 }).limit(20);
    return res.json(sessions);
  }

  const sessions = Array.from(inMemorySessions.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 20);

  return res.json(sessions);
}
