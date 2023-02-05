import { marketing } from './marketing/index.js';
import { jamaah } from './jamaah/index.js';
import { inventory } from './inventory/index.js';
import { setup } from './setup/index.js';
import { issue } from './issue/index.js';
import { karyawan } from './karyawan/index.js';
import { user } from './user/index.js';
import { donatur, event } from './donatur/index.js';
import { accounting } from './accounting/index.js';
import { auth } from './auth/index.js';
import { menu } from './menu/index.js';
import { utility } from './utility/index.js';
import { perencanaan } from './perencanaan/index.js';
 
var index = (request, response) => {
    var d= new Date();
    response.json({ info: 'API ERP ' + d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear() + " "+ 
    d.getHours()+":"+d.getMinutes()+":"+d.getMilliseconds() })
  };

export { index, marketing, jamaah, inventory, setup, issue, karyawan, user, donatur, accounting, 
         auth, menu, utility, event, perencanaan
 	   };

