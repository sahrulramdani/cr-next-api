import * as C from './controller/index.js';

 const routes = (app) => {
      app.route('/').get(C.index);

      //---- Setup ----
      app.route('/pekerjaans').get(C.setup.pekerjaanAll);
      app.route('/pendidikans').get(C.setup.pendidikanAll);
      app.route('/wilayah-kerjas').get(C.setup.wilayahKerjaAll);
      app.route('/type-relawans').get(C.setup.typeRelawanAll);
      app.route('/units').get(C.setup.unitAll);
      app.route('/locations').get(C.setup.locationAll);
      app.route('/bussiness-units').get(C.setup.bussinessUnitAll);
      app.route('/kelompok-kerjas').get(C.setup.kelompokKerjaAll);
      app.route('/status-maritals').get(C.setup.statusMaritalAll);
      app.route('/saveSetup').post(C.setup.saveSetup);
      app.route('/deleteSetup').post(C.setup.deleteSetup);
      app.route('/saveUnit').post(C.setup.saveUnit);
      app.route('/deleteUnit').post(C.setup.deleteUnit);

      //---- Issue - Master RKAT Issue Header  ------
      app.route('/issues').get(C.issue.issueAll);
      app.route('/saveIssue').post(C.issue.saveIssue);
      app.route('/issue/:id').get(C.issue.getIssue);
      app.route('/updateIssue').post(C.issue.updateIssue);
      app.route('/deleteIssue').post(C.issue.deleteIssue);

      // ----- Karyawan --------------
      app.route('/karyawan/:id').get(C.karyawan.getKaryawan);
      app.route('/saveKaryawan').post(C.karyawan.saveKaryawan);
      app.route('/saveKaryawanPrsh').post(C.karyawan.saveKaryawanPrsh);

      // ------ Management User --------------
      app.route('/users').get(C.user.userAll);
      app.route('/deleteUser').post(C.user.deleteUser);  // delete user hanya menonaktifkan user

      // ------ CRM --------------
      app.route('/idDonaturs/:status').get(C.donatur.idDonaturs);
      app.route('/donaturs/:status').get(C.donatur.donaturs);
      app.route('/donatur/:id').get(C.donatur.getDonatur);
      app.route('/donaturs/level/:level').get(C.donatur.getDonatursPerLevel);
      app.route('/type-donaturs').get(C.setup.typeDonaturAll);
      app.route('/type-program-donaturs').get(C.setup.typeProgramDonaturAll);
      app.route('/saveDonatur').post(C.donatur.saveDonatur);
      app.route('/updateDonatur').post(C.donatur.updateDonatur);
      app.route('/verifyDonatur').post(C.donatur.verify);
      app.route('/saveMasterFile').post(C.donatur.saveMasterFile);
      app.route('/masterFiles/:typeProgram/:tahunBuku').get(C.donatur.getMasterFiles);
      app.route('/saveTransSLP').post(C.donatur.saveTransSLP);
      app.route('/saveDetTransSLP1').post(C.donatur.saveDetTransSLP1);   // Save Transaksi SLP Attachments
      app.route('/saveDetTransSLP2').post(C.donatur.saveDetTransSLP2);   // Save Transaksi SLP Donaturs
      app.route('/SLPAttachments/:transNumber').get(C.donatur.getSLPAttachments);
      app.route('/SLPDonaturs/:transNumber').get(C.donatur.getSLPDonaturs);
      app.route('/deleteSLPAttachment').post(C.donatur.deleteSLPAttachment);
      app.route('/deleteSLPDonatur').post(C.donatur.deleteSLPDonatur);

      // ------ Accounting --------------
      app.route('/saveThnBuku').post(C.accounting.saveTahunBuku);
}


export default routes;