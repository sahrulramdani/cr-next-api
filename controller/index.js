import { setup } from './setup/index.js';
import { issue } from './issue/index.js';
import { karyawan } from './karyawan/index.js';
import { user } from './user/index.js';
import { donatur, event } from './donatur/index.js';
import { accounting } from './accounting/index.js';
import { auth } from './auth/index.js';
import { menu } from './menu/index.js';
import { utility } from './utility/index.js';
 
var index = (request, response) => {
    response.json({ info: 'API SISQU 23/11/2021 10:53' })
  };

export { index, setup, issue, karyawan, user, donatur, accounting, 
         auth, menu, utility, event
 	   };

