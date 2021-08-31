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
      app.route('/saveKaryawan').post(C.karyawan.saveKaryawan);
      app.route('/saveKaryawanPrsh').post(C.karyawan.saveKaryawanPrsh);
}


export default routes;