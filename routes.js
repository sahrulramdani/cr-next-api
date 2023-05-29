import * as C from './controller/index.js';
import express from 'express';
import sharp from 'sharp';
const routes = (app) => {

      app.route('/').get(C.index);
      //---- Marketing----
      app.route('/marketing/all-agency').get(C.auth.verifyToken ,C.marketing.getAllAgency);
      app.route('/marketing/calon-agency').get(C.auth.verifyToken, C.marketing.getCalonAgency);
      app.route('/marketing/agency/save').post(C.auth.verifyToken, C.marketing.saveAgency);
      app.route('/marketing/agency/save-foto').post(C.auth.verifyToken, C.marketing.saveFotoAgency);
      app.route('/marketing/agency/update').post(C.auth.verifyToken, C.marketing.updateAgency);
      app.route('/marketing/agency/update-foto').post(C.auth.verifyToken, C.marketing.updateFotoAgency);
      app.route('/marketing/agency/bank/save').post(C.auth.verifyToken, C.marketing.saveAgencyBank);
      app.route('/marketing/agency/det-daftar/save').get(C.marketing.getDetDaftarAgency);
      app.route('/marketing/agency/detail/:id').get(C.marketing.getDetailAgency);
      app.route('/marketing/agency/detail/pelanggan/:id').get(C.auth.verifyToken ,C.marketing.getDetailPelangganAgency);
      app.route('/marketing/agency/detail/bank/:id').get(C.auth.verifyToken ,C.marketing.getDetailBankAgency);
      app.route('/marketing/agency/detail/downline/:id').get(C.auth.verifyToken ,C.marketing.getDetailDownlineAgency);
      app.route('/marketing/agency/detail/upline/:id').get(C.auth.verifyToken, C.marketing.getDetailUpline);

      //--- Marketing Jadwal --
      app.route("/marketing/jadwal/getjenispaket").get(C.auth.verifyToken ,C.marketing.getJenisPaket);
      app.route("/marketing/jadwal/getpaket").get(C.auth.verifyToken ,C.marketing.getPaket);
      app.route("/marketing/jadwal/getmatauang").get(C.auth.verifyToken ,C.marketing.getMataUang);
      app.route("/marketing/jadwal/getAllJadwal").get(C.auth.verifyToken ,C.marketing.getAllJadwal);
      app.route("/marketing/jadwal/getAllJadwalDash").get(C.marketing.getAllJadwalDash);
      app.route("/marketing/jadwal/getDetailDash/:id").get(C.marketing.getDetailDashJadwal);
      app.route("/marketing/jadwal/get-jadwal").get(C.marketing.getJadwalAvailable);
      app.route("/marketing/jadwal/getTransit").get(C.auth.verifyToken ,C.marketing.getTransit);
      app.route("/marketing/jadwal/getMaskapai").get(C.auth.verifyToken ,C.marketing.getMaskapai);
      app.route("/marketing/jadwal/getHotel").get(C.auth.verifyToken ,C.marketing.getHotel);
      app.route("/marketing/jadwal/getKantorUser/:id").get(C.auth.verifyToken ,C.marketing.getKantorUser);
      // app.route("/marketing/jadwal/getHotelMekkah").get(C.auth.verifyToken ,C.marketing.getHotelMekkah);
      // app.route("/marketing/jadwal/getHotelMadinah").get(C.auth.verifyToken ,C.marketing.getHotelMadinah);
      // app.route("/marketing/jadwal/getHotelPlus").get(C.auth.verifyToken ,C.marketing.getHotelPlus);
      // app.route("/marketing/jadwal/getHotelTransit").get(C.auth.verifyToken ,C.marketing.getHotelTransit);
      app.route("/marketing/jadwal/getKota").get(C.marketing.getKota);

      app.route("/marketing/jadwal/getDetail/:id").get(C.auth.verifyToken, C.marketing.getDetailJadwal);
      app.route("/marketing/jadwal/getDetail-jamaah/:id").get(C.auth.verifyToken, C.marketing.getDetailJadwalJamaah);
      app.route("/marketing/jadwal/save").post(C.auth.verifyToken, C.marketing.saveJadwal);
      app.route("/marketing/jadwal/save-foto").post(C.auth.verifyToken, C.marketing.saveFotoJadwal);
      app.route("/marketing/jadwal/update").post(C.auth.verifyToken, C.marketing.updateJadwal);
      app.route("/marketing/jadwal/update-foto").post(C.auth.verifyToken, C.marketing.updateFotoJadwal);
      app.route('/marketing/jadwal/delete').post(C.auth.verifyToken, C.marketing.deleteJadwal);

      //-- Marketing Pemberangkatan --
      app.route('/marketing/pemberangkatan/all-pemberangkatan').get(C.auth.verifyToken, C.marketing.getAllPemberangkatan);
      app.route('/marketing/pemberangkatan/list-jamaah-berangkat/:id').get(C.auth.verifyToken, C.marketing.getListJamaahPemberangkatan);
      app.route('/marketing/pemberangkatan/detail-jamaah-berangkat/:id').get(C.auth.verifyToken, C.marketing.getDetailJamaahPemberangkatan);

      //-- Marketing Rute Transit --
      app.route("/marketing/rutetransit/getDetailTransit/:id").get(C.auth.verifyToken, C.marketing.getDetailTransit);
      app.route("/marketing/rutetransit/save").post(C.auth.verifyToken, C.marketing.saveRuteTransit);
      app.route("/marketing/rutetransit/update").post(C.auth.verifyToken, C.marketing.updateRuteTransit);
      app.route("/marketing/rutetransit/delete").post(C.auth.verifyToken, C.marketing.deleteRuteTransit);

      //-- Marketing Maskapai --
      app.route('/marketing/maskapai/save').post(C.auth.verifyToken, C.marketing.saveMaskapai);
      app.route('/marketing/maskapai/save-foto').post(C.auth.verifyToken, C.marketing.saveFotoMaskapai);
      app.route('/marketing/maskapai/update').post(C.auth.verifyToken, C.marketing.updateMaskapai);
      app.route('/marketing/maskapai/update-foto').post(C.auth.verifyToken, C.marketing.updateFotoMaskapai);
      app.route('/marketing/maskapai/delete').post(C.auth.verifyToken, C.marketing.deleteMaskapai);
      app.route('/marketing/maskapai/getDetailMaskapai/:id').get(C.auth.verifyToken, C.marketing.getDetailMaskapai);
 
      //-- Marketing Hotel
      app.route('/marketing/hotel/save').post(C.auth.verifyToken, C.marketing.saveHotel);
      app.route('/marketing/hotel/update').post(C.auth.verifyToken, C.marketing.updateHotel);
      app.route('/marketing/hotel/delete').post(C.auth.verifyToken, C.marketing.deleteHotel);
      app.route('/marketing/hotel/getBintangHtl').get(C.auth.verifyToken, C.marketing.getBintangHotel);
      app.route('/marketing/hotel/getKategori').get(C.auth.verifyToken, C.marketing.getKategori);
      app.route('/marketing/hotel/getDetailHotel/:id').get(C.auth.verifyToken, C.marketing.getDetailHotel);

      app.route('/marketing/bandara/get-all').get(C.auth.verifyToken, C.marketing.getAllBandara);
      app.route('/marketing/bandara/jenis-bandara').get(C.auth.verifyToken, C.marketing.getJenisBandara);
      app.route('/marketing/bandara/save').post(C.auth.verifyToken, C.marketing.saveBandara);
      app.route('/marketing/bandara/update').post(C.auth.verifyToken, C.marketing.updateBandara);
      app.route('/marketing/bandara/delete').post(C.auth.verifyToken, C.marketing.deleteBandara);
      app.route('/marketing/bandara/get-detail/:id').get(C.auth.verifyToken, C.marketing.getDetailBandara);

      app.route('/marketing/tourlead/all-tourleader').get(C.auth.verifyToken, C.marketing.getAllTourleader);
      app.route('/marketing/tourlead/get-tourleader').get(C.auth.verifyToken, C.marketing.getOnlyTourleader);
      app.route('/marketing/tourlead/all-jadwal-tl').get(C.auth.verifyToken, C.marketing.getAllJadwalTL);
      app.route('/marketing/tourlead/tl-siap').get(C.auth.verifyToken, C.marketing.getTLSiap);
      app.route('/marketing/tourlead/save-tugas-tl').post(C.auth.verifyToken, C.marketing.saveTugasTL);
      app.route('/marketing/tourlead/delete-tugas-tl').post(C.auth.verifyToken, C.marketing.deleteTugasTL);
      app.route('/marketing/tourlead/detail-jadwal-tl/:id/:nik').get(C.auth.verifyToken, C.marketing.getDetJadwalTl);
      app.route('/marketing/tourlead/detail-jamaah-tl/:id/:tgl').get(C.auth.verifyToken, C.marketing.getDetJamaahTl);

      //---- Chart Marketing
      app.route('/marketing/chart').get(C.marketing.getChart);

      //---- Inventory Satuan ----
      app.route("/inventory/satuan/getAllSatuan").get(C.auth.verifyToken, C.inventory.getAllSatuan);
      app.route("/inventory/satuan/getDetailSatuan/:id").get(C.auth.verifyToken, C.inventory.getDetailSatuan);
      app.route("/inventory/satuan/update").post(C.auth.verifyToken, C.inventory.updateInventory);
      app.route("/inventory/satuan/save").post(C.auth.verifyToken, C.inventory.saveInvetorySatuan);
      app.route("/inventory/satuan/delete").post(C.auth.verifyToken, C.inventory.deleteInventorySatuan);

      //---- Inventory Barang ----
      app.route("/inventory/barang/getAllBarang").get(C.auth.verifyToken ,C.inventory.getBarangAll);
      app.route("/inventory/barang/get-id").get(C.auth.verifyToken ,C.inventory.generateNumberBarang);
      // app.route("/generate-nomor/cek").get(C.auth.verifyToken ,C.inventory.getNumberKode);
      app.route('/inventory/barang/save').post(C.auth.verifyToken ,C.inventory.saveBarang);
      app.route('/inventory/barang/update').post(C.auth.verifyToken ,C.inventory.updateBarang);
      app.route('/inventory/barang/updateStok').post(C.auth.verifyToken ,C.inventory.updateStokBarang);
      app.route('/inventory/barang/delete').post(C.auth.verifyToken ,C.inventory.deleteBarang);
      app.route("/inventory/barang/getdetail/:id").get(C.auth.verifyToken ,C.inventory.getDetailBarang);

      //--- Inventory Grup Barang
      app.route("/inventory/grupbrg/getGrupBrgHeaderAll").get(C.auth.verifyToken ,C.inventory.getGrupBrgHeaderAll);
      app.route("/inventory/grupsbrg/getGrupDetail/:id").get(C.auth.verifyToken ,C.inventory.getGrupBrgDetail);
      app.route("/inventory/grupbrg/save").post(C.auth.verifyToken ,C.inventory.saveGrupBarangHeader);
      app.route("/inventory/grupbrg/saveDetail").post(C.auth.verifyToken ,C.inventory.saveGrupBarangDetail);
      app.route("/inventory/grupbrg/deleteGrupBarang").post(C.auth.verifyToken ,C.inventory.deleteGrupBarang);
      app.route("/inventory/grupbrg/deleteGrupBarangDetail").post(C.auth.verifyToken ,C.inventory.deleteGrupBarangDetail);

      // --- Inventory Grup Handling
      app.route("/inventory/handling/grup-handling").get(C.auth.verifyToken ,C.inventory.getGrupHandAll);
      app.route("/inventory/handling/handling-detail/:kode").get(C.auth.verifyToken ,C.inventory.getGrupHandDetail);
      app.route("/inventory/handling/handling-barang/save").post(C.auth.verifyToken ,C.inventory.saveHandlingBarang);
      app.route("/inventory/handling/handling-barang/delete").post(C.auth.verifyToken ,C.inventory.deleteHandlingBarang);


      // --- Jamaah Jamaah --

      app.route('/jamaah/all-jamaah').get(C.auth.verifyToken ,C.jamaah.getAllJamaah);
      app.route('/jamaah/all-pelanggan').get(C.auth.verifyToken ,C.jamaah.getPelanggan);
      app.route('/jamaah/jamaah/save').post(C.auth.verifyToken ,C.jamaah.saveJamaah);
      app.route('/jamaah/jamaah/save-foto').post(C.auth.verifyToken ,C.jamaah.saveFotoJamaah);
      app.route('/jamaah/jamaah/update').post(C.auth.verifyToken ,C.jamaah.updateJamaah);
      app.route('/jamaah/jamaah/update-foto').post(C.auth.verifyToken ,C.jamaah.updateFotoJamaah);
      app.route('/jamaah/jamaah/delete').post(C.auth.verifyToken ,C.jamaah.deleteJamaah);
      app.route('/jamaah/jamaah/detail/:id').get(C.auth.verifyToken ,C.jamaah.getDetailJamaah);
      app.route('/jamaah/jamaah/detail/info-paket/:id').get(C.auth.verifyToken ,C.jamaah.getDetailInfoPaket);
      app.route('/jamaah/jamaah/detail/info-pelanggan/:id').get(C.auth.verifyToken ,C.jamaah.getDetailInfoPelanggan);
      app.route('/jamaah/jamaah/detail/info-estimasi/:id').get(C.auth.verifyToken ,C.jamaah.getDetailInfoEstimasi);
      app.route('/jamaah/jamaah/detail/info-bayar/:id').get(C.auth.verifyToken ,C.jamaah.getDetailRiwayatBayar);
      app.route('/jamaah/jamaah/lainnya/kwitansi/:id').get(C.auth.verifyToken ,C.jamaah.getLainnyaKwitansi);
      app.route('/jamaah/jamaah/lainnya/kwitansi-detail/:id').get(C.auth.verifyToken ,C.jamaah.getLainnyaKwitansiDet);

      // --- Jamaah Pendaftaran --
      app.route('/jamaah/pendaftaran/kode').get(C.auth.verifyToken ,C.jamaah.generateNumberPendaftaran);
      app.route('/jamaah/pendaftaran/get-handling/:kode').get(C.jamaah.getPendaftaranHandling);
      app.route('/jamaah/pendaftaran/save').post(C.auth.verifyToken ,C.jamaah.pendaftaranJamaah);
      app.route('/jamaah/pendaftaran/save-foto').post(C.auth.verifyToken ,C.jamaah.pendaftaranJamaahFoto);

      // --- Finance Pembayaran --  
      // Chart
      app.route('/finance/chart/total-bulanan').get(C.auth.verifyToken ,C.finance.getPembayaranBulanan);
      app.route('/finance/info-data/total-tagihan').get(C.auth.verifyToken ,C.finance.getTotalTagihan);
      app.route('/finance/info-data/list-cabang').get(C.auth.verifyToken ,C.finance.getPembayaranCabang);

      app.route('/finance/penerbangan/get-profit').get(C.auth.verifyToken ,C.finance.getPenerbanganLoss);
      app.route('/finance/pembayaran/get-laporan/:tgl1/:tgl2/:jns/:noxx/:kode').get(C.auth.verifyToken ,C.finance.getLaporanPembayaran);
      app.route('/finance/pembayaran/get-jamaah').get(C.auth.verifyToken ,C.finance.getJamaahDenganTagihan);
      app.route('/finance/pembayaran/get-jadwal/:id').get(C.finance.getJadwalJamaah);
      app.route('/finance/pembayaran/get-tagihan/:id').get(C.auth.verifyToken ,C.finance.getTagihanJamaah);
      app.route('/finance/pembayaran/mutasi-rekening').get(C.auth.verifyToken ,C.finance.getMutasiRekening);
      app.route('/finance/pembayaran/no-faktur').get(C.finance.generateNumberFaktur);
      app.route('/finance/pembayaran/save').post(C.finance.savePembayaran);
      app.route('/finance/biaya/biaya-all').get(C.finance.getBiayaAll);
      app.route('/finance/biaya/biaya/get-id').get(C.finance.generateNumberBiaya);
      app.route('/finance/biaya/biaya/save').post(C.finance.saveBiaya);
      app.route('/finance/biaya/biaya/update').post(C.finance.updateBiaya);
      app.route('/finance/biaya/biaya/delete').post(C.finance.deleteBiaya);
      app.route('/finance/biaya/biaya/detail/:id').get(C.finance.getBiayaDetail);
      app.route('/finance/tagihan/get-laporan/:tgl1/:tgl2/:kode/:noxx/:cek').get(C.auth.verifyToken ,C.finance.getLaporanTagihan);

      // --- Finance Pembayaran --  

      app.route('/finance/gettree-account').get(C.auth.verifyToken, C.finance.listTreeAccount);
      app.route('/finance/all-account').get(C.auth.verifyToken, C.finance.getAllAccount);
      app.route('/finance/master-account/save').post(C.auth.verifyToken, C.finance.saveAccount);
      app.route('/finance/master-account/update').post(C.auth.verifyToken, C.finance.updateAccount);
      app.route('/finance/master-account/delete').post(C.auth.verifyToken, C.finance.deleteAccount);
      app.route('/finance/master-account/generate-kode/:id').get(C.auth.verifyToken, C.finance.generateKodeAccount);

      app.route('/finance/all-kasbank').get(C.auth.verifyToken, C.finance.getAllKasBank);
      app.route('/finance/kas-bank/generate-number').get(C.auth.verifyToken, C.finance.generateNumberKasBank);
      app.route('/finance/kas-bank/save').post(C.auth.verifyToken, C.finance.saveKasBank);
      app.route('/finance/kas-bank/update').post(C.auth.verifyToken, C.finance.updateKasBank);
      app.route('/finance/kas-bank/delete').post(C.auth.verifyToken, C.finance.deleteKasBank);
      app.route('/finance/kas-bank/detail/:id/:kode').get(C.auth.verifyToken, C.finance.getDetailKasBank);

      app.route('/finance/all-carabayar').get(C.auth.verifyToken, C.finance.getAllCaraBayar);
      app.route('/finance/all-carabayar/generate-number').get(C.auth.verifyToken, C.finance.generateNumberCaraBayar);

      app.route('/finance/all-estimasi-paket').get(C.auth.verifyToken, C.finance.getAllEstimasiPaket);
      app.route('/finance/estimasi-paket/save').post(C.auth.verifyToken, C.finance.saveEstimasiPaket);
      app.route('/finance/estimasi-paket/detail/:id').get(C.auth.verifyToken, C.finance.getDetailEstimasiPaket);

      app.route('/finance/all-pendapatan-biaya').get(C.auth.verifyToken, C.finance.getAllPendapatanBiaya);
      app.route('/finance/pendapatan-biaya/save').post(C.auth.verifyToken, C.finance.savePendapatanBiaya);
      app.route('/finance/pendapatan-biaya/update').post(C.auth.verifyToken, C.finance.updatePendapatanBiaya);
      app.route('/finance/pendapatan-biaya/delete').post(C.auth.verifyToken, C.finance.deletePendapatanBiaya);
      app.route('/finance/pendapatan-biaya/detail/:id').get(C.auth.verifyToken, C.finance.getDetailPendapatanBiaya);

      app.route('/finance/pendapatan-biaya/:kode').get(C.auth.verifyToken, C.finance.getPendapatanBiaya);
      app.route('/finance/all-cost-structure').get(C.auth.verifyToken, C.finance.getAllCostStructure);
      app.route('/finance/cost-structure/save').post(C.auth.verifyToken, C.finance.saveCostStructure);
      app.route('/finance/cost-structure/delete').post(C.auth.verifyToken, C.finance.deleteCostStructure);

      app.route('/finance/simulasi/pendapatan/:id').get(C.auth.verifyToken, C.finance.getPendapatanSimulasi);
      // --- Finance  --  

      app.use('/uploads/foto', express.static('uploads/foto'));
      app.use('/uploads/ktp', express.static('uploads/ktp'));
      app.use('/uploads/kk', express.static('uploads/kk'));
      app.use('/uploads/profil', express.static('uploads/profil'));
      app.use('/uploads/paket', express.static('uploads/paket'));
      app.use('/uploads/lampiran', express.static('uploads/lampiran'));
      app.use('/uploads/maskapai', express.static('uploads/maskapai'));

      app.get('/get-profil-koper/foto/:id', (req, res) => {
            var id = req.params.id;
            sharp('uploads/foto/' + id)
                  .rotate(90)
                  // Simpan gambar yang sudah diputar ke response
                  .pipe(res);
      });
      // app.route('/marketing/location').get(C.marketing.getLocation);
      // app.route('/marketing/agency/kode').get(C.marketing.getIDAgency);
      // app.route('/marketing/agency/delete').post(C.marketing.deleteAgency);
      // app.route('/marketing/agency/detail/bank/:id').get(C.marketing.getDetailBankAgency);

      app.route('/hr/kantor-all').get(C.auth.verifyToken ,C.hr.kantorAll);
      app.route('/hr/kantor/save').post(C.auth.verifyToken ,C.hr.saveKantor);
      app.route('/hr/kantor/update').post(C.auth.verifyToken ,C.hr.updateKantor);
      app.route('/hr/kantor/delete').post(C.auth.verifyToken ,C.hr.deleteKantor);
      app.route('/hr/kantor/detail/:id').get(C.auth.verifyToken ,C.hr.detailKantor);
      
      //---- Setup ----
      app.route('/setup/kantor').get(C.auth.verifyToken ,C.setup.kantorAll);
      app.route('/setup/fee-level').get(C.auth.verifyToken ,C.setup.getFeeLevel);
      app.route('/setup/grade-tl').get(C.auth.verifyToken ,C.setup.getGradeTL);
      app.route('/setup/status-menikah').get(C.setup.getStatusMenikah);
      app.route('/setup/pendidikans').get(C.setup.getPendidikan);
      app.route('/setup/pekerjaans').get(C.setup.getPekerjaan);
      app.route('/setup/banks').get(C.auth.verifyToken ,C.setup.getBankAll);
      app.route('/setup/kamars').get(C.setup.getKamarAll);
      app.route('/setup/jenis-biaya').get(C.setup.getJenisBiaya);
      app.route('/setup/biaya-paspor').get(C.setup.getBiayaPaspor);
      app.route('/setup/biaya-vaksin').get(C.setup.getBiayaVaksin);
      app.route('/setup/biaya-admin').get(C.setup.getBiayaAdmin);
      app.route('/setup/biaya-kamar').get(C.setup.getBiayaKamar);
      app.route('/setup/kategori-account').get(C.auth.verifyToken ,C.setup.getKategoriAccount);
      app.route('/setup/get-country').get(C.auth.verifyToken ,C.setup.getAllCountry);
      app.route('/setup/get-states/:id').get(C.auth.verifyToken ,C.setup.getAllStates);
      app.route('/setup/get-cities/:id').get(C.auth.verifyToken ,C.setup.getAllCities);
      app.route('/setup/get-komp-biaya').get(C.auth.verifyToken ,C.setup.getKompBiaya);
      app.route('/setup/kategori-akun').get(C.auth.verifyToken ,C.setup.getKategoriUser);
      app.route('/setup/musim-berjalan').get(C.auth.verifyToken ,C.setup.getMusimBerjalan);
      app.route('/setup/all-musim').get(C.auth.verifyToken ,C.setup.getAllMusim);
      app.route('/setup/musim/save').post(C.auth.verifyToken ,C.setup.saveMusim);
      app.route('/setup/musim/update-aktif').post(C.auth.verifyToken ,C.setup.updateAktifMusim);


      //---- Setup ----
      app.route('/info/dashboard/main-dashboard').get(C.auth.verifyToken, C.info.getMainDashboardInfo);

      // marketing
      app.route('/chart/dashboard/marketing').get(C.auth.verifyToken, C.info.getChartMarketing);
      app.route('/chart/dashboard/laporan-tahunan').get(C.auth.verifyToken, C.info.getChartLaporanTahunan);
      app.route('/data/dashboard/laporan-tahunan').get(C.auth.verifyToken, C.info.getDataLaporanTahunan);
      app.route('/data/dashboard/detail/laporan-tahunan').get(C.auth.verifyToken, C.info.getDetailLaporanTahunan);
      app.route('/data/dashboard/detail/laporan-pencapaian/:tahun/:kode').get(C.auth.verifyToken, C.info.getDetailLaporanPencapaian);
      app.route('/data/dashboard/marketing').get(C.auth.verifyToken, C.info.getDataAgensiMarketing);
      app.route('/info/dashboard/marketing').get(C.auth.verifyToken, C.info.getDataAgensiMarketing);

      app.route('/info/dashboard/agency').get(C.auth.verifyToken ,C.info.getInfoAgency);
      app.route('/info/dashboard/jadwal').get(C.auth.verifyToken ,C.info.getInfoJadwal);
      app.route('/info/dashboard/pemberangkatan').get(C.auth.verifyToken ,C.info.getInfoPemberangkatan);

      // jamaah
      app.route('/info/dashboard/jamaah').get(C.auth.verifyToken ,C.info.getInfoJamaah);
      app.route('/info/dashboard/calon-jamaah').get(C.auth.verifyToken ,C.info.getInfoCalonJamaah);
      app.route('/info/dashboard/daftar-jamaah').get(C.auth.verifyToken ,C.info.getInfoDaftarJamaah);
      app.route('/data/dashboard/jamaah').get(C.auth.verifyToken ,C.info.getDataJamaah);
      app.route('/chart/dashboard/jamaah').get(C.auth.verifyToken ,C.info.getChartJamaah);

      // overview
      app.route('/data/dashboard/overview').get(C.auth.verifyToken , C.info.getDataOverview);

      app.route('/info/dashboard/finance').get(C.auth.verifyToken , C.info.getInfoFinance);
      app.route('/chart/dashboard/finance').get(C.auth.verifyToken , C.info.getChartFinance);
      app.route('/data/dashboard/finance').get(C.auth.verifyToken , C.info.getDataFinance);

      // Menu Managemen
      app.route('/menu/grup-user/all').get(C.auth.verifyToken ,C.menu.getGrupUser);
      app.route('/menu/grup-user/nomor-grup').get(C.auth.verifyToken ,C.menu.generateNumberGrupUser);
      app.route('/menu/grup-user/save').post(C.auth.verifyToken ,C.menu.saveGrupUser);
      app.route('/menu/grup-user/update').post(C.menu.updateGrupUser);
      app.route('/menu/grup-user/delete').post(C.menu.deleteGrupUser);
      app.route('/menu/grup-user/detail/:id').get(C.auth.verifyToken ,C.menu.getDetailGrupUser);
      app.route('/menu/grup-user/detail/menu/:id').get(C.auth.verifyToken ,C.menu.getDetailMenuGrupUser);
      app.route('/menu/grup-user/detail/user/:id').get(C.auth.verifyToken ,C.menu.getDetailUserGrupUser);
      app.route('/menu/menus/all').get(C.auth.verifyToken ,C.menu.getMenuAll);
      app.route('/menu/type-menu/all').get(C.auth.verifyToken ,C.menu.getTypeAll);

      app.route('/menu/daftar-menu/module-all').get(C.menu.getMenuModulAll);
      // app.route('/menu/daftar-menu/module-all').get(C.menu.getModul);
      app.route('/menu/getmoduleall').get(C.menu.getModuleAll);
      app.route('/menu/get-module/user/:id').get(C.menu.getModuleByUser);
      app.route('/menu/daftar-submenu/submenuByMenu/:id').get(C.menu.getSubmenuByMenu);
      app.route('/menu/daftar-listmenu/listmenuBySubMenu/:id').get(C.menu.getLIstMenuBySubMenu);

      app.route('/menu/getTypeMdul').get(C.menu.getTypeMdul);
      app.route('/menu/listmenus/save').post(C.menu.savelistMenu);
      app.route('/menu/submenus/save').post(C.menu.savesubMenu);
      app.route('/menu/menus/save').post(C.menu.saveMenu);

      app.route('/menu/daftar-pengguna/all').get(C.auth.verifyToken ,C.menu.getPenggunaAll);
      app.route('/menu/daftar-pengguna/cek-pengguna/:id').get(C.auth.verifyToken ,C.menu.getCekPengguna);
      app.route('/menu/daftar-pengguna/save-foto').post(C.auth.verifyToken ,C.menu.saveFotoPengguna);
      app.route('/menu/daftar-pengguna/update').post(C.auth.verifyToken ,C.menu.updatePengguna);
      app.route('/menu/daftar-pengguna/update-foto').post(C.auth.verifyToken ,C.menu.updateFotoPengguna);
      app.route('/menu/daftar-pengguna/delete').post(C.auth.verifyToken ,C.menu.deletePengguna);
      app.route('/menu/daftar-pengguna/detail/menu/:id').get(C.auth.verifyToken ,C.menu.getPenggunaMenu);
      app.route('/menu/daftar-pengguna/detail/grup/:id').get(C.auth.verifyToken ,C.menu.getPenggunaGrup);
      app.route('/menu/daftar-pengguna/detail/:id').get(C.auth.verifyToken ,C.menu.getDetailPengguna);
      app.route('/menu/daftar-pengguna/update-akses').post(C.menu.updateAksesPengguna);

      // app.route('/menu/getmenus/:nama').get(C.menu.getlistMenus);
      app.route('/menu/getmenu/:nama').get(C.menu.getMenu);
      app.route('/menu/getSubMenu/:nama/:user').get(C.auth.verifyToken, C.menu.getSubmenu);
      app.route('/menu/getListMenu/:user').get(C.auth.verifyToken, C.menu.getlistMenus);

      // LOGIN AND REGISTER
      app.route('/register').post(C.auth.verifyToken, C.auth.register);
      app.route('/signin').post(C.auth.signin);
      app.route('/get-permission/:kode/:id').get(C.auth.verifyToken, C.auth.getPermission);

      // app.route('/setup/save').post(C.auth.verifyToken, C.setup.saveSetup);
      // app.route('/setup/update').post(C.auth.verifyToken, C.setup.updateSetup);
      // app.route('/setup/delete').post(C.auth.verifyToken, C.setup.deleteSetup);
      // app.route('/setup/pekerjaans').get(C.auth.verifyToken, C.setup.pekerjaanAll);
      // app.route('/setup/pendidikans').get(C.auth.verifyToken, C.setup.pendidikanAll);
      // app.route('/setup/wilayah-kerjas').get(C.auth.verifyToken, C.setup.wilayahKerjaAll);
      // app.route('/setup/bank-umums').get(C.auth.verifyToken, C.setup.bankUmumAll);
      // app.route('/setup/departments').get(C.auth.verifyToken, C.setup.departmentAll);
      // app.route('/setup/unit/banks/:bussCode').get(C.auth.verifyToken, C.setup.getDetUnitBanks);
      // app.route('/setup/unit/save').post(C.auth.verifyToken, C.setup.saveUnit);
      // app.route('/setup/unit/update').post(C.auth.verifyToken, C.setup.updateUnit);
      // app.route('/setup/unit/delete').post(C.auth.verifyToken, C.setup.deleteUnit);
      // app.route('/setup/unit/:id').get(C.auth.verifyToken, C.setup.getUnit);
      // app.route('/setup/units').get(C.auth.verifyToken, C.setup.unitAll);
      // app.route('/setup/units/showLogin').get(C.setup.unitShowLogin);
      // app.route('/setup/banks').get(C.auth.verifyToken, C.setup.bankAll);
      // app.route('/setup/bank/save').post(C.auth.verifyToken, C.setup.saveBank);
      // app.route('/setup/bank/update').post(C.auth.verifyToken, C.setup.updateBank);
      // app.route('/setup/bank/delete').post(C.auth.verifyToken, C.setup.deleteBank);
      // app.route('/setup/bank/:id').get(C.auth.verifyToken, C.setup.getBank);
      // app.route('/setup/method-payments').get(C.auth.verifyToken, C.setup.methodPaymentAll);
      // app.route('/setup/method-payment/:id').get(C.auth.verifyToken, C.setup.getPaymentMethod);
      // app.route('/setup/locations').get(C.auth.verifyToken, C.setup.locationAll);
      // app.route('/setup/code-areas').get(C.auth.verifyToken, C.setup.codeAreaAll);
      // app.route('/setup/bussiness-units').get(C.auth.verifyToken, C.setup.bussinessUnitAll);
      // app.route('/setup/kelompok-kerjas').get(C.auth.verifyToken, C.setup.kelompokKerjaAll);
      // app.route('/setup/status-maritals').get(C.auth.verifyToken, C.setup.statusMaritalAll);
      // app.route('/setup/gol-darahs').get(C.auth.verifyToken, C.setup.golDarahAll);
      // app.route('/setup/currencies').get(C.auth.verifyToken, C.setup.currencyAll);

      // //---- Penghimpunan ----------------------
      // //---- Issue - Master RKAT Issue Header  ------
      // app.route('/penghimpunan/issues').get(C.auth.verifyToken, C.issue.issueAll);
      // app.route('/penghimpunan/issue/save').post(C.auth.verifyToken, C.issue.saveIssue);
      // app.route('/penghimpunan/issue/update').post(C.auth.verifyToken, C.issue.updateIssue);
      // app.route('/penghimpunan/issue/delete').post(C.auth.verifyToken, C.issue.deleteIssue);
      // app.route('/penghimpunan/issue/:id').get(C.auth.verifyToken, C.issue.getIssue);

      // // ----- Payroll --------------
      // app.route('/payroll/setup/type-relawans').get(C.auth.verifyToken, C.setup.typeRelawanAll);
      // app.route('/payroll/karyawan/update').post(C.auth.verifyToken, C.karyawan.updateKaryawan);
      // app.route('/payroll/karyawan/save').post(C.auth.verifyToken, C.karyawan.saveKaryawan);
      // app.route('/payroll/karyawan/delete').post(C.auth.verifyToken, C.karyawan.deleteKaryawan);
      // app.route('/payroll/karyawan/donaturs/:id').get(C.auth.verifyToken, C.karyawan.getKaryawanDonaturs);
      // app.route('/payroll/karyawan-prsh/save').post(C.auth.verifyToken, C.karyawan.saveKaryawanPrsh);
      // app.route('/payroll/karyawan/self').get(C.auth.verifyToken, C.karyawan.getEmployeeSelf);
      // app.route('/payroll/karyawan/up').get(C.auth.verifyToken, C.karyawan.getEmployeeUp);
      // app.route('/payroll/karyawan/:id').get(C.auth.verifyToken, C.karyawan.getKaryawan);
      // app.route('/payroll/karyawans/:status').get(C.auth.verifyToken, C.karyawan.getEmployees);  // status: Status Karyawan
      // app.route('/payroll/group/relawans/:id').get(C.auth.verifyToken, C.karyawan.getGroupRelawans);
      // app.route('/payroll/group/relawan/delete').post(C.auth.verifyToken, C.karyawan.deleteRelawanGroup);
      // app.route('/payroll/group/relawan/save').post(C.auth.verifyToken, C.karyawan.saveRelawanGroup);
      // // app.route('/payroll/idKaryawans/:status').get(C.auth.verifyToken, C.karyawan.idKaryawans);

      // // ------ Management User --------------
      // app.route('/users').get(C.auth.verifyToken, C.user.userAll);
      // app.route('/user/delete').post(C.auth.verifyToken, C.user.deleteUser);  // delete user hanya menonaktifkan user
      // app.route('/user/update').post(C.auth.verifyToken, C.user.updateUser);
      // app.route('/user/save').post(C.auth.verifyToken, C.user.saveUser);
      // app.route('/user/privilege/delete').post(C.auth.verifyToken, C.user.deleteDetPrivilege);
      // app.route('/user/privilege/save').post(C.auth.verifyToken, C.user.saveDetPrivilege);
      // app.route('/user/privilege/update').post(C.auth.verifyToken, C.user.updateUserDetPrivilege);
      // app.route('/user/privilege/:id').get(C.auth.verifyToken, C.user.getDetUserAccess);
      // app.route('/user/privileges/saveAll').post(C.auth.verifyToken, C.user.saveAllDetPrivilege);
      // app.route('/user/privileges/:userID').get(C.auth.verifyToken, C.user.getDetUserAccesses);
      // app.route('/user/:userID').get(C.auth.verifyToken, C.user.getUser);
      // app.route('/roles').get(C.auth.verifyToken, C.user.roleAll);
      // app.route('/role/save').post(C.auth.verifyToken, C.user.saveRole);
      // app.route('/role/update').post(C.auth.verifyToken, C.user.updateRole);
      // app.route('/role/:id').get(C.auth.verifyToken, C.user.getRole);
      // app.route('/role/privilege/save').post(C.auth.verifyToken, C.user.saveRoleDetPrivilege);
      // app.route('/role/privilege/update').post(C.auth.verifyToken, C.user.updateDetPrivilege);
      // app.route('/role/privileges/saveAll').post(C.auth.verifyToken, C.user.saveRoleAllDetPrivilege);
      // app.route('/role/privilege/delete').post(C.auth.verifyToken, C.user.deleteRoleDetPrivilege);
      // app.route('/role/privileges/:roleID').get(C.auth.verifyToken, C.user.getRoleDetUserAccesses);
      // app.route('/role/privilege/:id').get(C.auth.verifyToken, C.user.getRolePrivilege);
      // app.route('/profile').get(C.auth.verifyToken, C.user.getProfile);
      // app.route('/profile/karyawan/update').post(C.auth.verifyToken, C.karyawan.updateKaryawanProfile);
      // app.route('/profile/karyawan/save').post(C.auth.verifyToken, C.karyawan.saveKaryawanProfile);
      // app.route('/profile/karyawan-prsh/save').post(C.auth.verifyToken, C.karyawan.saveKaryawanPrsh);
      // app.route('/profile/karyawan').get(C.auth.verifyToken, C.karyawan.getProfileKaryawan);
      // app.route('/profile/user/update').post(C.auth.verifyToken, C.user.updateUserProfile);
      // app.route('/profile/donatur/save').post(C.auth.verifyToken, C.donatur.saveDonaturProfile);
      // app.route('/profile/donatur/update').post(C.auth.verifyToken, C.donatur.updateDonaturProfile);
      // app.route('/profile/donatur').get(C.auth.verifyToken, C.donatur.getDonaturProfile);
      // app.route('/process/privilege').post(C.auth.verifyToken, C.user.getProcessPrivilege);

      // // ------ CRM --------------
      // app.route('/crm/setup/channel-donaturs').get(C.auth.verifyToken, C.setup.channelDonaturAll);
      // app.route('/crm/setup/type-donaturs').get(C.auth.verifyToken, C.setup.typeDonaturAll);
      // app.route('/crm/setup/type-program-donaturs').get(C.auth.verifyToken, C.setup.typeProgramDonaturAll);
      // app.route('/crm/setup/type-program-donatur/save').post(C.auth.verifyToken, C.setup.saveTypeProgramDonatur);
      // app.route('/crm/setup/type-program-donatur/update').post(C.auth.verifyToken, C.setup.updateTypeProgramDonatur);
      // app.route('/crm/setup/type-program-donatur/delete').post(C.auth.verifyToken, C.setup.deleteTypeProgramDonatur);
      // app.route('/crm/setup/type-program-donatur/:id').get(C.auth.verifyToken, C.setup.getTypeProgramDonatur);
      // app.route('/crm/setup/prog-donatur/update').post(C.auth.verifyToken, C.setup.updateSetupProgDonatur);
      // app.route('/crm/setup/prog-donaturs').get(C.auth.verifyToken, C.setup.donaturProgAll);
      // app.route('/crm/setup/segmen-profils').get(C.auth.verifyToken, C.setup.segmenProfilAll);
      // app.route('/crm/setup/category-donations').get(C.auth.verifyToken, C.setup.categoryDonasiAll);
      // app.route('/crm/setup/groups/:bussCode').get(C.auth.verifyToken, C.donatur.getGroups);
      // app.route('/crm/setup/group/save').post(C.auth.verifyToken, C.donatur.saveGroup);
      // app.route('/crm/setup/group/update').post(C.auth.verifyToken, C.donatur.updateGroup);
      // app.route('/crm/setup/group/donaturs/:id').get(C.auth.verifyToken, C.donatur.getGroupDonaturs);
      // app.route('/crm/setup/group/:id').get(C.auth.verifyToken, C.donatur.getGroup);
      // app.route('/crm/slp/save').post(C.auth.verifyToken, C.donatur.saveTransSLP);
      // app.route('/crm/slp/delete').post(C.auth.verifyToken, C.donatur.deleteTransSLP);
      // app.route('/crm/slp/update').post(C.auth.verifyToken, C.donatur.updateTransSLP);
      // app.route('/crm/slp/master-files').get(C.auth.verifyToken, C.donatur.masterFileAll);
      // app.route('/crm/slp/master-files/:typeProgram/:tahunBuku').get(C.auth.verifyToken, C.donatur.getMasterFiles);
      // app.route('/crm/slp/master-file/save').post(C.auth.verifyToken, C.donatur.saveMasterFile);
      // app.route('/crm/slp/attachments/:transNumber').get(C.auth.verifyToken, C.donatur.getSLPAttachments);
      // app.route('/crm/slp/attachment/save').post(C.auth.verifyToken, C.donatur.saveDetTransSLP1);   // Save Transaksi SLP Attachments
      // app.route('/crm/slp/attachment/delete').post(C.auth.verifyToken, C.donatur.deleteSLPAttachment);
      // app.route('/crm/slp/donatur/save').post(C.auth.verifyToken, C.donatur.saveDetTransSLP2);   // Save Transaksi SLP Donaturs
      // app.route('/crm/slp/donatur/update').post(C.auth.verifyToken, C.donatur.updateTransSLPDonatur);
      // app.route('/crm/slp/donaturs/:transNumber').get(C.auth.verifyToken, C.donatur.getSLPDonaturs);
      // app.route('/crm/slp/:id').get(C.auth.verifyToken, C.donatur.getTransSLP);
      // app.route('/crm/relawan/donatur/:id').get(C.auth.verifyToken, C.donatur.getRelawanDonatur);
      // app.route('/crm/slps/:status').get(C.auth.verifyToken, C.donatur.transSLPAll);
      // app.route('/crm/donaturs/verify').post(C.auth.verifyToken, C.donatur.verify);
      // app.route('/crm/donaturs/level/platinum/active/:level/:platinum/:active').get(C.auth.verifyToken, C.donatur.getDonatursPerLevelPlatinum);
      // app.route('/crm/donaturs/level/:level').get(C.auth.verifyToken, C.donatur.getDonatursPerLevel);
      // app.route('/crm/donaturs/:status').get(C.auth.verifyToken, C.donatur.donaturs);
      // app.route('/crm/donatur/events/:donaturID').get(C.auth.verifyToken, C.event.getEventsDonatur);
      // app.route('/crm/donatur/detail/transactions/:donaturID').get(C.auth.verifyToken, C.donatur.getDetTransactions);
      // app.route('/crm/donatur/relawan/transactions/:isValid').get(C.auth.verifyToken, C.donatur.getTransRelation);
      // app.route('/crm/donatur/transactions/filter/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getTransactionsFilter);
      // app.route('/crm/donatur/transactions/tunai').post(C.auth.verifyToken, C.donatur.getTransCash);
      // app.route('/crm/donatur/transactions/total/:isValid').get(C.auth.verifyToken, C.donatur.getTotalTransaction);
      // app.route('/crm/donatur/transactions2/:isValid/:limit?/:offset?').get(C.auth.verifyToken, C.donatur.getDonaturTransactions2);
      // app.route('/crm/donatur/transactions/:isValid').get(C.auth.verifyToken, C.donatur.getDonaturTransactions);
      // app.route('/crm/donatur/transactions/:isValid/:bussCode').get(C.auth.verifyToken, C.donatur.getDonaturTransactions);
      // app.route('/crm/donatur/transaction/simpan').post(C.auth.verifyToken, C.donatur.saveDetTransaction2);  // API External
      // app.route('/crm/donatur/transaction/save').post(C.auth.verifyToken, C.donatur.saveDetTransaction);
      // app.route('/crm/donatur/transaction/wa/update').post(C.auth.verifyToken, C.donatur.updateDonaturTrans2);  // API External
      // app.route('/crm/donatur/transaction/update').post(C.auth.verifyToken, C.donatur.updateDonaturTrans);
      // app.route('/crm/donatur/transaction/delete/soft').post(C.auth.verifyToken, C.donatur.deleteSoftDonaturTrans);
      // app.route('/crm/donatur/transaction/delete').post(C.auth.verifyToken, C.donatur.deleteDetTransaction);
      // app.route('/crm/donatur/transaction/verify').post(C.auth.verifyToken, C.donatur.verifyTrans);   // verify Tunai gelondongan
      // app.route('/crm/donatur/transaction/:id').get(C.auth.verifyToken, C.donatur.getTransaction);
      // app.route('/crm/donatur/save').post(C.auth.verifyToken, C.donatur.saveDonatur);
      // app.route('/crm/donatur/wa/update').post(C.auth.verifyToken, C.donatur.updateDonatur2);      // API External
      // app.route('/crm/donatur/update').post(C.auth.verifyToken, C.donatur.updateDonatur);
      // app.route('/crm/donatur/delete').post(C.auth.verifyToken, C.donatur.deleteDonatur);
      // app.route('/crm/donatur/:id').get(C.auth.verifyToken, C.donatur.getDonatur);
      // app.route('/crm/donatur').get(C.auth.verifyToken, C.donatur.getDonatur);
      // app.route('/crm/idDonaturs/all').get(C.auth.verifyToken, C.donatur.idDonatursAll);
      // app.route('/crm/idDonaturs/:status').get(C.auth.verifyToken, C.donatur.idDonaturs);
      // app.route('/crm/transaction/wa/payment_notification').post(C.auth.verifyToken, C.donatur.paymentWATransaction);  // API External
      // app.route('/crm/transaction/payment_notification').post(C.donatur.paymentTransaction);  // payment notification from BSI Virtual Account
      // app.route('/crm/simple_transaction/save').post(C.auth.verifyToken, C.donatur.saveSimpleTrans);    // API External
      // app.route('/crm/simple_transaction/update').post(C.auth.verifyToken, C.donatur.updateSimpleTrans);    // API External
      // app.route('/crm/transaction/item/delete').post(C.auth.verifyToken, C.donatur.deleteTransItem);
      // app.route('/crm/transaction/item/save').post(C.auth.verifyToken, C.donatur.saveTransItem);
      // app.route('/crm/transaction/item/simpan').post(C.auth.verifyToken, C.donatur.saveTransItemArray2);   // API External
      // app.route('/crm/transaction/item/saveArray').post(C.auth.verifyToken, C.donatur.saveTransItemArray);
      // app.route('/crm/transaction/items/:id').get(C.auth.verifyToken, C.donatur.getTransItems);
      // app.route('/crm/events').get(C.auth.verifyToken, C.event.getEvents);
      // app.route('/crm/event/donatur/save').post(C.auth.verifyToken, C.event.saveEventDonatur);
      // app.route('/crm/event/donatur/delete').post(C.auth.verifyToken, C.event.deleteEventDonatur);
      // app.route('/crm/event/donaturs/:id').get(C.auth.verifyToken, C.event.getEventDonaturs);
      // app.route('/crm/event/save').post(C.auth.verifyToken, C.event.saveEvent);
      // app.route('/crm/event/delete').post(C.auth.verifyToken, C.event.deleteEvent);
      // app.route('/crm/event/update').post(C.auth.verifyToken, C.event.updateEvent);
      // app.route('/crm/event/:id').get(C.auth.verifyToken, C.event.getEvent);
      // app.route('/crm/summary/transactions').get(C.auth.verifyToken, C.donatur.getSummaryTransaction); 
      // app.route('/crm/summary/transactions-per-week').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerWeek);
      // app.route('/crm/summary/transactions-per-program/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerProgram);
      // app.route('/crm/summary/transactions-per-program2/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerProgram2);
      // app.route('/crm/summary/transactions-per-month/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerMonth);
      // app.route('/crm/partner/transactions-per-month/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getPartnerTransactions);
      // app.route('/crm/summary/transactions-per-channel/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getTransactionsPerChannel);
      // app.route('/crm/summary/transactions-per-channel2/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getTransactionsPerChannel2);
      // app.route('/crm/summary/transactions-per-group/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerGroup);
      // app.route('/crm/summary/transactions-per-group2/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerGroup2);
      // app.route('/crm/summary/transactions-per-relawan/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerRelawan);
      // app.route('/crm/summary/transactions-per-unit/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getSummaryTransactionPerUnit);
      // app.route('/crm/transactions-per-group/:tgl1/:tgl2').get(C.auth.verifyToken, C.donatur.getDetTransactionsPerGroup);

      // // ------ Accounting --------------
      // app.route('/accounting/tahun-periode/list').get(C.auth.verifyToken, C.accounting.getListPeriode);
      // app.route('/accounting/tahun-buku/save').post(C.auth.verifyToken, C.accounting.saveTahunBuku);
      // app.route('/accounting/tahun-buku/update').post(C.auth.verifyToken, C.accounting.updatePeriode);
      // app.route('/accounting/tahun-buku/active').get(C.auth.verifyToken, C.accounting.getActiveTahunBuku);
      // app.route('/accounting/tahun-buku/:id').get(C.auth.verifyToken, C.accounting.getTahunPeriode);
      // app.route('/accounting/tahun-donasi/active').get(C.auth.verifyToken, C.accounting.getActiveTahunDonasi);
      // app.route('/accounting/tahun-bukus').get(C.auth.verifyToken, C.accounting.tahunBukuAll);
      // app.route('/accounting/mutasi/save').post(C.auth.verifyToken, C.accounting.saveMutasi);
      // app.route('/accounting/mutasi/update').post(C.auth.verifyToken, C.accounting.updateMutasi);
      // app.route('/accounting/mutasi/all/:bankID/:limit/:offset').get(C.auth.verifyToken, C.accounting.mutasiAll);
      // //app.route('/accounting/mutasi/tanggal/:tgl1/:tgl2').get(C.auth.verifyToken, C.accounting.mutasiFilterDate);
      // app.route('/accounting/mutasi/filter-field/:tgl/:field/:value').get(C.auth.verifyToken, C.accounting.mutasiFilter);
      // app.route('/accounting/mutasi/filter/:tgl').get(C.auth.verifyToken, C.accounting.mutasiFilter);
      // app.route('/accounting/mutasi/:id').get(C.auth.verifyToken, C.accounting.getMutasi);
      // app.route('/accounting/mutasi/total/:bankID').get(C.auth.verifyToken, C.accounting.getCountMutasi);
      // app.route('/accounting/saldo-bank').get(C.auth.verifyToken, C.accounting.getSaldoBank);
      // app.route('/accounting/summary/bank/:tgl1/:tgl2').get(C.auth.verifyToken, C.accounting.summaryBank);

      // // ------ Menu Management --------------
      // app.route('/menu/modules/all').get(C.auth.verifyToken, C.menu.module0All);
      // app.route('/menu/modules/:bussCode/:typeModule').get(C.auth.verifyToken, C.menu.moduleAll);
      // app.route('/menu/module/save').post(C.auth.verifyToken, C.menu.saveModule);
      // app.route('/menu/module/update').post(C.auth.verifyToken, C.menu.updateModule);
      // app.route('/menu/module/process/save2').post(C.auth.verifyToken, C.menu.saveDetProcess2);
      // app.route('/menu/module/process/saveAll').post(C.auth.verifyToken, C.menu.saveDetProcessAll);
      // app.route('/menu/module/process/save').post(C.auth.verifyToken, C.menu.saveDetProcess);
      // app.route('/menu/module/process/delete').post(C.auth.verifyToken, C.menu.deleteDetProcess);
      // app.route('/menu/module/:id').get(C.auth.verifyToken, C.menu.getModule);
      // app.route('/menu/processes/:bussCode/:module/:typeMdul?').get(C.auth.verifyToken, C.menu.processAll);
      // app.route('/menu/menus').get(C.auth.verifyToken, C.menu.getMenus);
      // app.route('/menu/menus2/:userID').get(C.auth.verifyToken, C.menu.getMenus2);

      // // ------ Utility --------------
      // app.route('/utility/sequence/save').post(C.auth.verifyToken, C.utility.saveSequence);
      // app.route('/utility/sequence/update').post(C.auth.verifyToken, C.utility.updateSequence);
      // app.route('/utility/sequence/:initial/:tahun/:bussCode').get(C.auth.verifyToken, C.utility.getSequence);

      // // ------ Perencanaan --------------
      // app.route('/prog-kerja/list').get(C.auth.verifyToken, C.perencanaan.listProgramKerja);
      // app.route('/prog-kerja/save').post(C.auth.verifyToken, C.perencanaan.saveProgKerja);
      // app.route('/prog-kerja/update').post(C.auth.verifyToken, C.perencanaan.updateProgKerja);
      // app.route('/prog-kerja/delete/:id').get(C.auth.verifyToken, C.perencanaan.deleteProgKerja);  // id: Kode Program
      // app.route('/prog-kerja/:id').get(C.auth.verifyToken, C.perencanaan.getProgramKerja);   // id: Kode Program
      // app.route('/progkerja/getData').get(C.perencanaan.getTreeview);
}


export default routes;