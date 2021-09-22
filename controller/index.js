import { setup } from './setup/index.js';
import { issue } from './issue/index.js';
import { karyawan } from './karyawan/index.js';
import { user } from './user/index.js';
import { donatur } from './donatur/index.js';
import { accounting } from './accounting/index.js';
import { auth } from './auth/index.js';
 
var index = (request, response) => {
    response.json({ info: 'API SISQU' })
  };

export { index, setup, issue, karyawan, user, donatur, accounting, 
         auth
 	   };

