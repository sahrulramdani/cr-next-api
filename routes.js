import * as C from './controller/index.js';

 const routes = (app) => {
      app.route('/').get(C.index);

      //---- Setup ----
      app.route('/pekerjaans').get(C.auth.verifyToken, C.setup.pekerjaanAll);
      app.route('/pendidikans').get(C.auth.verifyToken, C.setup.pendidikanAll);
      app.route('/wilayah-kerjas').get(C.auth.verifyToken, C.setup.wilayahKerjaAll);
      app.route('/type-relawans').get(C.auth.verifyToken, C.setup.typeRelawanAll);
      app.route('/units').get(C.auth.verifyToken, C.setup.unitAll);
      app.route('/unit/:id').get(C.auth.verifyToken, C.setup.getUnit);
      app.route('/locations').get(C.auth.verifyToken, C.setup.locationAll);
      app.route('/bussiness-units').get(C.auth.verifyToken, C.setup.bussinessUnitAll);
      app.route('/kelompok-kerjas').get(C.auth.verifyToken, C.setup.kelompokKerjaAll);
      app.route('/status-maritals').get(C.auth.verifyToken, C.setup.statusMaritalAll);
      app.route('/channel-donaturs').get(C.auth.verifyToken, C.setup.channelDonaturAll);
      app.route('/gol-darahs').get(C.auth.verifyToken, C.setup.golDarahAll);
      app.route('/saveSetup').post(C.auth.verifyToken, C.setup.saveSetup);
      app.route('/deleteSetup').post(C.auth.verifyToken, C.setup.deleteSetup);
      app.route('/saveUnit').post(C.auth.verifyToken, C.setup.saveUnit);
      app.route('/updateUnit').post(C.auth.verifyToken, C.setup.updateUnit);
      app.route('/deleteUnit').post(C.auth.verifyToken, C.setup.deleteUnit);

      //---- Issue - Master RKAT Issue Header  ------
      app.route('/issues').get(C.auth.verifyToken, C.issue.issueAll);
      app.route('/saveIssue').post(C.auth.verifyToken, C.issue.saveIssue);
      app.route('/issue/:id').get(C.auth.verifyToken, C.issue.getIssue);
      app.route('/updateIssue').post(C.auth.verifyToken, C.issue.updateIssue);
      app.route('/deleteIssue').post(C.auth.verifyToken, C.issue.deleteIssue);

      // ----- Karyawan --------------
      app.route('/karyawan/:id').get(C.auth.verifyToken, C.karyawan.getKaryawan);
      app.route('/saveKaryawan').post(C.auth.verifyToken, C.karyawan.saveKaryawan);
      app.route('/saveKaryawanPrsh').post(C.auth.verifyToken, C.karyawan.saveKaryawanPrsh);

      // ------ Management User --------------
      app.route('/users').get(C.auth.verifyToken, C.user.userAll);
      app.route('/deleteUser').post(C.auth.verifyToken, C.user.deleteUser);  // delete user hanya menonaktifkan user
      app.route('/register').post(C.auth.verifyToken, C.auth.register);
      app.route('/signin').post(C.auth.verifyToken, C.auth.signin);

      // ------ CRM --------------
      app.route('/idDonaturs/:status').get(C.auth.verifyToken, C.donatur.idDonaturs);
      app.route('/donaturs/:status').get(C.auth.verifyToken, C.donatur.donaturs);
      app.route('/donatur/:id').get(C.auth.verifyToken, C.donatur.getDonatur);
      app.route('/donaturs/level/:level').get(C.auth.verifyToken, C.donatur.getDonatursPerLevel);
      app.route('/type-donaturs').get(C.auth.verifyToken, C.setup.typeDonaturAll);
      app.route('/type-program-donaturs').get(C.auth.verifyToken, C.setup.typeProgramDonaturAll);
      app.route('/saveDonatur').post(C.auth.verifyToken, C.donatur.saveDonatur);
      app.route('/updateDonatur').post(C.auth.verifyToken, C.donatur.updateDonatur);
      app.route('/verifyDonatur').post(C.auth.verifyToken, C.donatur.verify);
      app.route('/saveMasterFile').post(C.auth.verifyToken, C.donatur.saveMasterFile);
      app.route('/masterFiles/:typeProgram/:tahunBuku').get(C.auth.verifyToken, C.donatur.getMasterFiles);
      app.route('/masterFiles').get(C.auth.verifyToken, C.donatur.masterFileAll);
      app.route('/saveTransSLP').post(C.auth.verifyToken, C.donatur.saveTransSLP);
      app.route('/saveDetTransSLP1').post(C.auth.verifyToken, C.donatur.saveDetTransSLP1);   // Save Transaksi SLP Attachments
      app.route('/saveDetTransSLP2').post(C.auth.verifyToken, C.donatur.saveDetTransSLP2);   // Save Transaksi SLP Donaturs
      app.route('/SLPAttachments/:transNumber').get(C.auth.verifyToken, C.donatur.getSLPAttachments);
      app.route('/SLPDonaturs/:transNumber').get(C.auth.verifyToken, C.donatur.getSLPDonaturs);
      app.route('/deleteSLPAttachment').post(C.auth.verifyToken, C.donatur.deleteSLPAttachment);
      app.route('/deleteSLPDonatur').post(C.auth.verifyToken, C.donatur.deleteSLPDonatur);
      app.route('/transSLPs').get(C.auth.verifyToken, C.donatur.transSLPAll);
      app.route('/deleteTransSLP').post(C.auth.verifyToken, C.donatur.deleteTransSLP);
      app.route('/transSLP/:id').get(C.auth.verifyToken, C.donatur.getTransSLP);
      app.route('/updateTransSLP').post(C.auth.verifyToken, C.donatur.updateTransSLP);

      // ------ Accounting --------------
      app.route('/saveThnBuku').post(C.auth.verifyToken, C.accounting.saveTahunBuku);
      app.route('/tahunBukus').get(C.auth.verifyToken, C.accounting.tahunBukuAll);
}


export default routes;