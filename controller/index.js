import { marketing } from './marketing/index.js';
import { jamaah } from './jamaah/index.js';
import { inventory } from './inventory/index.js';
import { setup } from './setup/index.js';
import { info } from './info/index.js';
import { finance } from './finance/index.js';
import { issue } from './issue/index.js';
import { hr } from './hr/index.js';
import { user } from './user/index.js';
import { donatur, event } from './donatur/index.js';
import { accounting } from './accounting/index.js';
import { auth } from './auth/index.js';
import { menu } from './menu/index.js';
import { utility } from './utility/index.js';
import { perencanaan } from './perencanaan/index.js';
 
var index = (request, response) => {
    var d= new Date();
    response.json({ info: 'API Cahaya Raudhah ' + d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear() + " "+ 
    d.getHours()+":"+d.getMinutes()+":"+d.getMilliseconds() })
  };

export { index, marketing, jamaah, inventory, setup, info ,finance ,issue, hr, user, donatur, accounting, 
         auth, menu, utility, event, perencanaan
 	   };

