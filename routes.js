require('dotenv').config();
const { Router } = require('express');
const controller = require('./controllers/index');
const giretcache = require('./controllers/giretcache');
const authentication = require('./middleware/auth');
const router = Router();

router.get('/', controller.gigaChad);

// raw untouched data
router.get('/raw', controller.databaru);

// sorted data
router.get('/alldatasorted', controller.getAllData);

// sorted pra data
router.get('/allpradatasorted', controller.getAllPraData);

// specific data
router.get('/listsekolah', controller.getAllSchoolNames);
router.get('/data/:kodSekolah', controller.sortByKodSekolah);
router.get('/data/:kodSekolah/:tahun', controller.sortByKodSekolahAndTahun);
router.get(
  '/data/:kodSekolah/:tahun/:kelas',
  controller.sortByKodSekolahAndTahunAndKelas
);

// pegawai data
router.get('/pegawai', controller.queryPegawai);

// mdtb data
router.get('/mdtb', controller.queryMdtb);

// fasiliti data
router.get('/fasiliti', controller.getAllFasiliti);

// mysjid
router.get('/mysjid', controller.checkTheirID);

// get cache
router.get('/cache', giretcache.getCache);

// save to cache
router.post('/cache', giretcache.saveToCache);

router.get('/cache/initial', giretcache.getInitialData);
router.post('/cache/initial', giretcache.saveInitialData);

router.get('/sr', (req, res) => {
  const sekolahrendah = data.sekolahRendah;
  res.send(sekolahrendah);
});

router.get('/sr/:id', (req, res) => {
  const sekolahrendah = data.sekolahRendah;
  const singleSekolah = sekolahrendah.find(
    (sekolah) => sekolah.id === parseInt(req.params.id)
  );
  res.json({ singleSekolah });
});

router.get('/sm', (req, res) => {
  const sekolahmenengah = data.sekolahMenengah;
  res.send(sekolahmenengah);
});

router.get('/sm/:id', (req, res) => {
  const sekolahmenengah = data.sekolahMenengah;
  const singleSekolah = sekolahmenengah.find(
    (sekolah) => sekolah.id === parseInt(req.params.id)
  );
  res.json({ singleSekolah });
});

module.exports = router;
