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
      app.route('/setup/bank-umums').get(C.auth.verifyToken, C.setup.bankUmumAll);
      app.route('/setup/departments').get(C.auth.verifyToken, C.setup.departmentAll);
      app.route('/setup/unit/banks/:bussCode').get(C.auth.verifyToken, C.setup.getDetUnitBanks);
      app.route('/setup/unit/save').post(C.auth.verifyToken, C.setup.saveUnit);
      app.route('/setup/unit/update').post(C.auth.verifyToken, C.setup.updateUnit);
      app.route('/setup/unit/delete').post(C.auth.verifyToken, C.setup.deleteUnit);
      app.route('/setup/unit/:id').get(C.auth.verifyToken, C.setup.getUnit);
      app.route('/setup/units').get(C.auth.verifyToken, C.setup.unitAll);
      app.route('/setup/banks').get(C.auth.verifyToken, C.setup.bankAll);
      app.route('/setup/bank/save').post(C.auth.verifyToken, C.setup.saveBank);
      app.route('/setup/bank/update').post(C.auth.verifyToken, C.setup.updateBank);
      app.route('/setup/bank/delete').post(C.auth.verifyToken, C.setup.deleteBank);
      app.route('/setup/bank/:id').get(C.auth.verifyToken, C.setup.getBank);
      app.route('/setup/method-payments').get(C.auth.verifyToken, C.setup.methodPaymentAll);
      app.route('/setup/method-payment/:id').get(C.auth.verifyToken, C.setup.getPaymentMethod);
      app.route('/setup/locations').get(C.auth.verifyToken, C.setup.locationAll);
      app.route('/setup/code-areas').get(C.auth.verifyToken, C.setup.codeAreaAll);
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
      app.route('/payroll/karyawan/update').post(C.auth.verifyToken, C.karyawan.updateKaryawan);
      app.route('/payroll/karyawan/save').post(C.auth.verifyToken, C.karyawan.saveKaryawan);
      app.route('/payroll/karyawan/donaturs/:id').get(C.auth.verifyToken, C.karyawan.getKaryawanDonaturs);
      app.route('/payroll/karyawan-prsh/save').post(C.auth.verifyToken, C.karyawan.saveKaryawanPrsh);
      app.route('/payroll/karyawan/self').get(C.auth.verifyToken, C.karyawan.getEmployeeSelf);
      app.route('/payroll/karyawan/up').get(C.auth.verifyToken, C.karyawan.getEmployeeUp);
      app.route('/payroll/karyawan/:id').get(C.auth.verifyToken, C.karyawan.getKaryawan);
      app.route('/payroll/karyawans/:status').get(C.auth.verifyToken, C.karyawan.getEmployees);  // status: Status Karyawan
      app.route('/payroll/group/relawans/:id').get(C.auth.verifyToken, C.karyawan.getGroupRelawans);
      // app.route('/payroll/idKaryawans/:status').get(C.auth.verifyToken, C.karyawan.idKaryawans);

      // ------ Management User --------------
      app.route('/users').get(C.auth.verifyToken, C.user.userAll);
      app.route('/user/delete').post(C.auth.verifyToken, C.user.deleteUser);  // delete user hanya menonaktifkan user
      app.route('/user/update').post(C.auth.verifyToken, C.user.updateUser);
      app.route('/user/save').post(C.auth.verifyToken, C.user.saveUser);
      app.route('/user/privilege/delete').post(C.auth.verifyToken, C.user.deleteDetPrivilege);
      app.route('/user/privilege/save').post(C.auth.verifyToken, C.user.saveDetPrivilege);
      app.route('/user/privilege/update').post(C.auth.verifyToken, C.user.updateUserDetPrivilege);
      app.route('/user/privilege/:id').get(C.auth.verifyToken, C.user.getDetUserAccess);
      app.route('/user/privileges/saveAll').post(C.auth.verifyToken, C.user.saveAllDetPrivilege);
      app.route('/user/privileges/:userID').get(C.auth.verifyToken, C.user.getDetUserAccesses);
      app.route('/user/:userID').get(C.auth.verifyToken, C.user.getUser);
      app.route('/roles').get(C.auth.verifyToken, C.user.roleAll);
      app.route('/role/save').post(C.auth.verifyToken, C.user.saveRole);
      app.route('/role/update').post(C.auth.verifyToken, C.user.updateRole);
      app.route('/role/:id').get(C.auth.verifyToken, C.user.getRole);
      app.route('/role/privilege/save').post(C.auth.verifyToken, C.user.saveRoleDetPrivilege);
      app.route('/role/privilege/update').post(C.auth.verifyToken, C.user.updateDetPrivilege);
      app.route('/role/privileges/saveAll').post(C.auth.verifyToken, C.user.saveRoleAllDetPrivilege);
      app.route('/role/privilege/delete').post(C.auth.verifyToken, C.user.deleteRoleDetPrivilege);
      app.route('/role/privileges/:roleID').get(C.auth.verifyToken, C.user.getRoleDetUserAccesses);
      app.route('/role/privilege/:id').get(C.auth.verifyToken, C.user.getRolePrivilege);
      app.route('/register').post(C.auth.register);
      app.route('/signin').post(C.auth.signin);
      app.route('/profile').get(C.auth.verifyToken, C.user.getProfile);
      app.route('/profile/karyawan/update').post(C.auth.verifyToken, C.karyawan.updateKaryawanProfile);
      app.route('/profile/karyawan/save').post(C.auth.verifyToken, C.karyawan.saveKaryawanProfile);
      app.route('/profile/karyawan-prsh/save').post(C.auth.verifyToken, C.karyawan.saveKaryawanPrsh);
      app.route('/profile/karyawan').get(C.auth.verifyToken, C.karyawan.getProfileKaryawan);
      app.route('/profile/user/update').post(C.auth.verifyToken, C.user.updateUserProfile);
      app.route('/profile/donatur/save').post(C.auth.verifyToken, C.donatur.saveDonaturProfile);
      app.route('/profile/donatur/update').post(C.auth.verifyToken, C.donatur.updateDonaturProfile);
      app.route('/profile/donatur').get(C.auth.verifyToken, C.donatur.getDonaturProfile);
      app.route('/process/privilege').post(C.auth.verifyToken, C.user.getProcessPrivilege);

      // ------ CRM --------------
      app.route('/crm/setup/channel-donaturs').get(C.auth.verifyToken, C.setup.channelDonaturAll);
      app.route('/crm/setup/type-donaturs').get(C.auth.verifyToken, C.setup.typeDonaturAll);
      app.route('/crm/setup/type-program-donaturs').get(C.auth.verifyToken, C.setup.typeProgramDonaturAll);
      app.route('/crm/setup/type-program-donatur/save').post(C.auth.verifyToken, C.setup.saveTypeProgramDonatur);
      app.route('/crm/setup/type-program-donatur/update').post(C.auth.verifyToken, C.setup.updateTypeProgramDonatur);
      app.route('/crm/setup/type-program-donatur/delete').post(C.auth.verifyToken, C.setup.deleteTypeProgramDonatur);
      app.route('/crm/setup/type-program-donatur/:id').get(C.auth.verifyToken, C.setup.getTypeProgramDonatur);
      app.route('/crm/setup/prog-donatur/update').post(C.auth.verifyToken, C.setup.updateSetupProgDonatur);
      app.route('/crm/setup/prog-donaturs').get(C.auth.verifyToken, C.setup.donaturProgAll);
      app.route('/crm/setup/segmen-profils').get(C.auth.verifyToken, C.setup.segmenProfilAll);
      app.route('/crm/setup/category-donations').get(C.auth.verifyToken, C.setup.categoryDonasiAll);
      app.route('/crm/setup/groups/:bussCode').get(C.auth.verifyToken, C.donatur.getGroups);
      app.route('/crm/setup/group/save').post(C.auth.verifyToken, C.donatur.saveGroup);
      app.route('/crm/setup/group/update').post(C.auth.verifyToken, C.donatur.updateGroup);
      app.route('/crm/setup/group/donaturs/:id').get(C.auth.verifyToken, C.donatur.getGroupDonaturs);
      app.route('/crm/setup/group/:id').get(C.auth.verifyToken, C.donatur.getGroup);
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
      app.route('/crm/slp/donatur/update').post(C.auth.verifyToken, C.donatur.updateTransSLPDonatur);
      app.route('/crm/slp/donaturs/:transNumber').get(C.auth.verifyToken, C.donatur.getSLPDonaturs);
      app.route('/crm/slp/:id').get(C.auth.verifyToken, C.donatur.getTransSLP);
      app.route('/crm/relawan/donatur/:id').get(C.auth.verifyToken, C.donatur.getRelawanDonatur);
      app.route('/crm/slps/:status').get(C.auth.verifyToken, C.donatur.transSLPAll);
      app.route('/crm/donaturs/verify').post(C.auth.verifyToken, C.donatur.verify);
      app.route('/crm/donaturs/level/platinum/active/:level/:platinum/:active').get(C.auth.verifyToken, C.donatur.getDonatursPerLevelPlatinum);
      app.route('/crm/donaturs/level/:level').get(C.auth.verifyToken, C.donatur.getDonatursPerLevel);
      app.route('/crm/donaturs/:status').get(C.auth.verifyToken, C.donatur.donaturs);
      app.route('/crm/donatur/detail/transactions/:donaturID').get(C.auth.verifyToken, C.donatur.getDetTransactions);
      app.route('/crm/donatur/relawan/transactions/:isValid').get(C.auth.verifyToken, C.donatur.getTransRelation);
      app.route('/crm/donatur/transactions/filter/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getTransactionsFilter);
      app.route('/crm/donatur/transactions/:isValid').get(C.auth.verifyToken, C.donatur.getDonaturTransactions);
      app.route('/crm/donatur/transactions/:isValid/:bussCode').get(C.auth.verifyToken, C.donatur.getDonaturTransactions);
      app.route('/crm/donatur/transaction/save').post(C.auth.verifyToken, C.donatur.saveDetTransaction);
      app.route('/crm/donatur/transaction/update').post(C.auth.verifyToken, C.donatur.updateDonaturTrans);
      app.route('/crm/donatur/transaction/delete/soft').post(C.auth.verifyToken, C.donatur.deleteSoftDonaturTrans);
      app.route('/crm/donatur/transaction/delete').post(C.auth.verifyToken, C.donatur.deleteDetTransaction);
      app.route('/crm/donatur/transaction/:id').get(C.auth.verifyToken, C.donatur.getTransaction);
      app.route('/crm/donatur/save').post(C.auth.verifyToken, C.donatur.saveDonatur);
      app.route('/crm/donatur/update').post(C.auth.verifyToken, C.donatur.updateDonatur);
      app.route('/crm/donatur/:id').get(C.auth.verifyToken, C.donatur.getDonatur);
      app.route('/crm/donatur').get(C.auth.verifyToken, C.donatur.getDonatur);
      app.route('/crm/idDonaturs/all').get(C.auth.verifyToken, C.donatur.idDonatursAll);
      app.route('/crm/idDonaturs/:status').get(C.auth.verifyToken, C.donatur.idDonaturs);
      app.route('/crm/transaction/item/delete').post(C.auth.verifyToken, C.donatur.deleteTransItem);
      app.route('/crm/transaction/item/save').post(C.auth.verifyToken, C.donatur.saveTransItem);
      app.route('/crm/transaction/item/saveArray').post(C.auth.verifyToken, C.donatur.saveTransItemArray);
      app.route('/crm/transaction/items/:id').get(C.auth.verifyToken, C.donatur.getTransItems);
      app.route('/crm/events').get(C.auth.verifyToken, C.event.getEvents);
      app.route('/crm/event/donatur/save').post(C.auth.verifyToken, C.event.saveEventDonatur);
      app.route('/crm/event/donatur/delete').post(C.auth.verifyToken, C.event.deleteEventDonatur);
      app.route('/crm/event/donaturs/:id').get(C.auth.verifyToken, C.event.getEventDonaturs);
      app.route('/crm/event/save').post(C.auth.verifyToken, C.event.saveEvent);
      app.route('/crm/event/delete').post(C.auth.verifyToken, C.event.deleteEvent);
      app.route('/crm/event/update').post(C.auth.verifyToken, C.event.updateEvent);
      app.route('/crm/event/:id').get(C.auth.verifyToken, C.event.getEvent);
      app.route('/crm/summary/transactions').get(C.auth.verifyToken, C.donatur.getSummaryTransaction); 
      app.route('/crm/summary/transactions-per-week').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerWeek);
      app.route('/crm/summary/transactions-per-program/:period').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerProgram);
      app.route('/crm/summary/transactions-per-month').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerMonth);
      app.route('/crm/partner/transactions-per-month').get(C.auth.verifyToken, C.donatur.getPartnerTransactions);
      app.route('/crm/summary/transactions-per-channel/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getTransactionsPerChannel);

      // ------ Accounting --------------
      app.route('/accounting/tahun-buku/save').post(C.auth.verifyToken, C.accounting.saveTahunBuku);
      app.route('/accounting/tahun-buku/active').get(C.auth.verifyToken, C.accounting.getActiveTahunBuku);
      app.route('/accounting/tahun-bukus').get(C.auth.verifyToken, C.accounting.tahunBukuAll);
      app.route('/accounting/mutasi/save').post(C.auth.verifyToken, C.accounting.saveMutasi);
      app.route('/accounting/mutasi/update').post(C.auth.verifyToken, C.accounting.updateMutasi);
      app.route('/accounting/mutasi/all/:bankID/:limit/:offset').get(C.auth.verifyToken, C.accounting.mutasiAll);
      //app.route('/accounting/mutasi/tanggal/:tgl1/:tgl2').get(C.auth.verifyToken, C.accounting.mutasiFilterDate);
      app.route('/accounting/mutasi/filter-field/:tgl/:field/:value').get(C.auth.verifyToken, C.accounting.mutasiFilter);
      app.route('/accounting/mutasi/filter/:tgl').get(C.auth.verifyToken, C.accounting.mutasiFilter);
      app.route('/accounting/mutasi/:id').get(C.auth.verifyToken, C.accounting.getMutasi);
      app.route('/accounting/mutasi/total/:bankID').get(C.auth.verifyToken, C.accounting.getCountMutasi);
      app.route('/accounting/saldo-bank').get(C.auth.verifyToken, C.accounting.getSaldoBank);
      app.route('/accounting/summary/bank').get(C.auth.verifyToken, C.accounting.summaryBank);

      // ------ Menu Management --------------
      app.route('/menu/modules/all').get(C.auth.verifyToken, C.menu.module0All);
      app.route('/menu/modules/:bussCode/:typeModule').get(C.auth.verifyToken, C.menu.moduleAll);
      app.route('/menu/module/save').post(C.auth.verifyToken, C.menu.saveModule);
      app.route('/menu/module/update').post(C.auth.verifyToken, C.menu.updateModule);
      app.route('/menu/module/process/save2').post(C.auth.verifyToken, C.menu.saveDetProcess2);
      app.route('/menu/module/process/saveAll').post(C.auth.verifyToken, C.menu.saveDetProcessAll);
      app.route('/menu/module/process/save').post(C.auth.verifyToken, C.menu.saveDetProcess);
      app.route('/menu/module/process/delete').post(C.auth.verifyToken, C.menu.deleteDetProcess);
      app.route('/menu/module/:id').get(C.auth.verifyToken, C.menu.getModule);
      app.route('/menu/processes/:bussCode/:module').get(C.auth.verifyToken, C.menu.processAll);
      app.route('/menu/menus').get(C.auth.verifyToken, C.menu.getMenus);
      app.route('/menu/menus2/:userID').get(C.auth.verifyToken, C.menu.getMenus2);

      // ------ Utility --------------
      app.route('/utility/sequence/save').post(C.auth.verifyToken, C.utility.saveSequence);
      app.route('/utility/sequence/update').post(C.auth.verifyToken, C.utility.updateSequence);
      app.route('/utility/sequence/:initial/:tahun/:bussCode').get(C.auth.verifyToken, C.utility.getSequence);
}


export default routes;