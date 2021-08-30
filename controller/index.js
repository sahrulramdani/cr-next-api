import { setup } from './setup/index.js';
import { issue } from './issue/index.js';
 
var index = (request, response) => {
    response.json({ info: 'API SISQU' })
  };

export { index, setup, issue };

