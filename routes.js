require('dotenv').config();
const { data } = require('./ERKM-dummy');
const { Router } = require('express');
const controller = require('./controllers/index');
const router = Router();

router.get('/', controller.gigaChad);

router.get('/semuasekolah', controller.getAllSchoolNames);

// router.get('/data', controller.databaru);
router.get('/data/:kodSekolah', controller.sortByKodSekolah);
// router.get('/data', controller.sortByKodSekolahAndKodKelas);
router.get('/count', controller.testings);
router.get('/listpelajar', controller.listPelajarByKodSekolah);
router.get('/listpelajar/:kodSekolah', controller.showKelasByTahun);

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
