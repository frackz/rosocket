import { Router } from 'express';
export const Routes = Router();

import { connect } from './connect.js';
import { send } from './send.js';
import { messages } from './messages.js';
import { close } from './close.js';


Routes.use(connect);
Routes.use(send);
Routes.use(messages);
Routes.use(close);