require('dotenv').config();
const { data } = require('./ERKM-dummy');
const { gigaChad } = require('./gigachad');
const { Router } = require('express');
const router = Router();

router.get('/', gigaChad);

router.get('/data', (req, res) => {
  console.log(data);
  res.send(data);
});

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
