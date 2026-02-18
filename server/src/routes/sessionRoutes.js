import { Router } from 'express';
import {
  createSession,
  finishSession,
  getSession,
  listSessions
} from '../controllers/sessionController.js';

const router = Router();

router.post('/', createSession);
router.get('/', listSessions);
router.get('/:id', getSession);
router.post('/:id/finish', finishSession);

export default router;
