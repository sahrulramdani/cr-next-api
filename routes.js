import * as C from './controller/index.js';

 const routes = (app) => {
      app.route('/').get(C.index);

      //---- Setup ----
      app.route('/setup/save').post(C.auth.verifyToken, C.setup.saveSetup);
      app.route('/setup/update').post(C.auth.verifyToken, C.setup.updateSetup);
      app.route('/setup/delete').post(C.auth.verifyToken, C.setup.deleteSetup);
      app.route('/setup/pekerjaans').get(C.auth.verifyToken, C.setup.pekerjaanAll);
      app.route('/setup/pendidikans').get(C.auth.verifyToken, C.setup.pendidikanAll);
      app.route('/setup/wilayah-kerjas').get(C.auth.verifyToken, C.setup.wilayahKerjaAll);
      app.route('/setup/unit/save').post(C.auth.verifyToken, C.setup.saveUnit);
      app.route('/setup/unit/update').post(C.auth.verifyToken, C.setup.updateUnit);
      app.route('/setup/unit/delete').post(C.auth.verifyToken, C.setup.deleteUnit);
      app.route('/setup/unit/:id').get(C.auth.verifyToken, C.setup.getUnit);
      app.route('/setup/units').get(C.auth.verifyToken, C.setup.unitAll);
      app.route('/setup/locations').get(C.auth.verifyToken, C.setup.locationAll);
      app.route('/setup/bussiness-units').get(C.auth.verifyToken, C.setup.bussinessUnitAll);
      app.route('/setup/kelompok-kerjas').get(C.auth.verifyToken, C.setup.kelompokKerjaAll);
      app.route('/setup/status-maritals').get(C.auth.verifyToken, C.setup.statusMaritalAll);
      app.route('/setup/gol-darahs').get(C.auth.verifyToken, C.setup.golDarahAll);
      app.route('/setup/currencies').get(C.auth.verifyToken, C.setup.currencyAll);

      //---- Penghimpunan ----------------------
      //---- Issue - Master RKAT Issue Header  ------
      app.route('/penghimpunan/issues').get(C.auth.verifyToken, C.issue.issueAll);
      app.route('/penghimpunan/issue/save').post(C.auth.verifyToken, C.issue.saveIssue);
      app.route('/penghimpunan/issue/update').post(C.auth.verifyToken, C.issue.updateIssue);
      app.route('/penghimpunan/issue/delete').post(C.auth.verifyToken, C.issue.deleteIssue);
      app.route('/penghimpunan/issue/:id').get(C.auth.verifyToken, C.issue.getIssue);

      // ----- Payroll --------------
      app.route('/payroll/setup/type-relawans').get(C.auth.verifyToken, C.setup.typeRelawanAll);
      app.route('/payroll/karyawan/save').post(C.auth.verifyToken, C.karyawan.saveKaryawan);
      app.route('/payroll/karyawah-prsh/save').post(C.auth.verifyToken, C.karyawan.saveKaryawanPrsh);
      app.route('/payroll/karyawan/:id').get(C.auth.verifyToken, C.karyawan.getKaryawan);

      // ------ Management User --------------
      app.route('/users').get(C.auth.verifyToken, C.user.userAll);
      app.route('/user/delete').post(C.auth.verifyToken, C.user.deleteUser);  // delete user hanya menonaktifkan user
      app.route('/user/update').post(C.auth.verifyToken, C.user.updateUser);
      app.route('/user/privilege/delete').post(C.auth.verifyToken, C.user.deleteDetPrivilege);
      app.route('/user/privilege/save').post(C.auth.verifyToken, C.user.saveDetPrivilege);
      app.route('/user/privilege/:id').get(C.auth.verifyToken, C.user.getDetUserAccess);
      app.route('/user/privileges/:userID').get(C.auth.verifyToken, C.user.getDetUserAccesses);
      app.route('/user/:userID').get(C.auth.verifyToken, C.user.getUser);
      app.route('/role/save').post(C.auth.verifyToken, C.user.saveRole);
      app.route('/role/privilege/save').post(C.auth.verifyToken, C.user.saveRoleDetPrivilege);
      app.route('/role/privilege/update').post(C.auth.verifyToken, C.user.updateDetPrivilege);
      app.route('/role/privileges/saveAll').post(C.auth.verifyToken, C.user.saveRoleAllDetPrivilege);
      app.route('/role/privilege/delete').post(C.auth.verifyToken, C.user.deleteRoleDetPrivilege);
      app.route('/role/privileges/:roleID').get(C.auth.verifyToken, C.user.getRoleDetUserAccesses);
      app.route('/role/privilege/:id').get(C.auth.verifyToken, C.user.getRolePrivilege);
      app.route('/register').post(C.auth.register);
      app.route('/signin').post(C.auth.signin);
      app.route('/profile').get(C.auth.verifyToken, C.user.getProfile);

      // ------ CRM --------------
      app.route('/crm/setup/channel-donaturs').get(C.auth.verifyToken, C.setup.channelDonaturAll);
      app.route('/crm/setup/type-donaturs').get(C.auth.verifyToken, C.setup.typeDonaturAll);
      app.route('/crm/setup/type-program-donaturs').get(C.auth.verifyToken, C.setup.typeProgramDonaturAll);
      app.route('/crm/slp/save').post(C.auth.verifyToken, C.donatur.saveTransSLP);
      app.route('/crm/slp/delete').post(C.auth.verifyToken, C.donatur.deleteTransSLP);
      app.route('/crm/slp/update').post(C.auth.verifyToken, C.donatur.updateTransSLP);
      app.route('/crm/slp/master-files').get(C.auth.verifyToken, C.donatur.masterFileAll);
      app.route('/crm/slp/master-files/:typeProgram/:tahunBuku').get(C.auth.verifyToken, C.donatur.getMasterFiles);
      app.route('/crm/slp/master-file/save').post(C.auth.verifyToken, C.donatur.saveMasterFile);
      app.route('/crm/slp/attachments/:transNumber').get(C.auth.verifyToken, C.donatur.getSLPAttachments);
      app.route('/crm/slp/attachment/save').post(C.auth.verifyToken, C.donatur.saveDetTransSLP1);   // Save Transaksi SLP Attachments
      app.route('/crm/slp/attachment/delete').post(C.auth.verifyToken, C.donatur.deleteSLPAttachment);
      app.route('/crm/slp/donatur/save').post(C.auth.verifyToken, C.donatur.saveDetTransSLP2);   // Save Transaksi SLP Donaturs
      app.route('/crm/slp/donatur/delete').post(C.auth.verifyToken, C.donatur.deleteSLPDonatur);
      app.route('/crm/slp/donaturs/:transNumber').get(C.auth.verifyToken, C.donatur.getSLPDonaturs);
      app.route('/crm/slp/:id').get(C.auth.verifyToken, C.donatur.getTransSLP);
      app.route('/crm/slps').get(C.auth.verifyToken, C.donatur.transSLPAll);
      app.route('/crm/donaturs/verify').post(C.auth.verifyToken, C.donatur.verify);
      app.route('/crm/donaturs/:status').get(C.auth.verifyToken, C.donatur.donaturs);
      app.route('/crm/donatur/transactions/:donaturID').get(C.auth.verifyToken, C.donatur.getDetTransactions);
      app.route('/crm/donatur/transaction/save').post(C.auth.verifyToken, C.donatur.saveDetTransaction);
      app.route('/crm/donatur/transaction/delete').post(C.auth.verifyToken, C.donatur.deleteDetTransaction);
      app.route('/crm/donatur/save').post(C.auth.verifyToken, C.donatur.saveDonatur);
      app.route('/crm/donatur/update').post(C.auth.verifyToken, C.donatur.updateDonatur);
      app.route('/crm/donatur/:id').get(C.auth.verifyToken, C.donatur.getDonatur);
      app.route('/crm/idDonaturs/:status').get(C.auth.verifyToken, C.donatur.idDonaturs);
      app.route('/crm/donaturs/level/:level').get(C.auth.verifyToken, C.donatur.getDonatursPerLevel);

      // ------ Accounting --------------
      app.route('/accounting/tahun-buku/save').post(C.auth.verifyToken, C.accounting.saveTahunBuku);
      app.route('/accounting/tahun-bukus').get(C.auth.verifyToken, C.accounting.tahunBukuAll);

      // ------ Menu Management --------------
      app.route('/menu/modules/:bussCode/:typeModule').get(C.auth.verifyToken, C.menu.moduleAll);
      app.route('/menu/module/update').post(C.auth.verifyToken, C.menu.updateModule);
      app.route('/menu/module/process/save').post(C.auth.verifyToken, C.menu.saveDetProcess);
      app.route('/menu/module/process/delete').post(C.auth.verifyToken, C.menu.deleteDetProcess);
      app.route('/menu/module/:id').get(C.auth.verifyToken, C.menu.getModule);
      app.route('/menu/processes/:bussCode/:module').get(C.auth.verifyToken, C.menu.processAll);
      app.route('/menu/menus').get(C.auth.verifyToken, C.menu.getMenus);
      app.route('/menu/menus2/:userID').get(C.auth.verifyToken, C.menu.getMenus2);
}


export default routes;