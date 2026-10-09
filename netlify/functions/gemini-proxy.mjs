import {createHandler} from '../../lib/tutor.js';
const env = name => globalThis.Netlify?.env?.get(name) ?? process.env[name];
export default createHandler({env});
export const config = {
  rateLimit: {action:'rate_limit', aggregateBy:'ip', windowSize:60, windowLimit:200}
};
