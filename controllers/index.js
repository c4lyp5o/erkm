const _ = require('lodash');
const { gigaChad } = require('../gigachad');
const dataPerlis = require('../db/erkm.json');
// const { forEach } = require('lodash');

exports.gigaChad = gigaChad;

exports.databaru = (req, res) => {
  res.status(200).json({ dataPerlis });
};

exports.getAllSchoolNames = (req, res) => {
  // init array
  let data = [];
  // init keys
  const key1 = 'NAMASEKOLAH';
  const key2 = 'KODSEKOLAH';
  const key3 = 'NAMAKELAS';
  // 1st pass
  const sekolahdata = [
    ...new Map(
      dataPerlis.map((item) => [
        item[key1],
        {
          namaSekolah: item[key1],
          kodSekolah: item[key2],
          jumlahKelas: item[key3],
        },
      ])
    ).values(),
  ];
  // 2nd pass
  // const arrayUniqueByKey = [
  //   ...new Map(dataPerlis.map((item) => [item[key1], item])).values(),
  // ];
  // console.log(arrayUniqueByKey);
  // 3rd pass
  // const testing = _.uniqBy(dataPerlis, 'NAMASEKOLAH');
  // const testing2 = _.uniqBy(dataPerlis, 'KODSEKOLAH');
  // const testing3 = _.uniqBy(dataPerlis, 'THNTING');
  // let testing4 = [];
  // const moretest = _.forEach(dataPerlis, (item) => {
  //   forEach(sekolahdata, (item2) => {
  //     if (item.NAMASEKOLAH === item2.namaSekolah) {
  //       const heee = {
  //         pelajar: {
  //           nama: item.NAMA,
  //         },
  //       };
  //       // data.push({
  //       //   namaSekolah: item.NAMASEKOLAH,
  //       //   kodSekolah: item.KODSEKOLAH,
  //       //   tahunTing: item.THNTING,
  //       // });
  //     }
  //   });
  // });
  // let testing5 = [];
  // let testing6 = {};
  // _.forEach(dataPerlis, (item) => {
  //   _.forEach(sekolahdata, (item2) => {
  //     testing6 = { ...testing6, [item2.namaSekolah]: [] };
  //     //   namaSekolah: item.NAMASEKOLAH,
  //     //   kodSekolah: item.KODSEKOLAH,
  //     //   tahunTing: item.THNTING,
  //     //   pelajar: {
  //     //     nama: item.NAMA,
  //     //   },
  //     // };
  //     // testing5 = [...testing5, { namaSekolah: item2.NAMASEKOLAH, pelajar: { nama: item.NAMA } }];
  //     if (item.NAMASEKOLAH === item2.namaSekolah) {
  //       testing6 = {
  //         ...testing6,
  //         [item2.namaSekolah]: [...testing6[{ ...item.NAMA }]],
  //       };
  //       // testing5 = [...testing5, item.NAMA];
  //     }
  //   });
  // });
  // console.log(testing6);
  // const { NAMASEKOLAH, KODSEKOLAH, THNTING } = item;
  // data.push({
  //   namaSekolah: NAMASEKOLAH,
  //   kodSekolah: KODSEKOLAH,
  //   tahunTing: THNTING,
  // });
  // console.log(moretest);
  // 4th pass
  const sekolahRendah = _.filter(sekolahdata, (o) => {
    return o.kodSekolah.match(/^RC|^RB/);
  });
  const jumlahPelajarSekolahRendah = _.sumBy(sekolahRendah, 'jumlahPelajar');
  const sekolahMenengah = _.filter(sekolahdata, (o) => {
    return o.kodSekolah.match(/^RE|^RF|^RH|^RR/);
  });
  const jumlahPelajarSekolahMenengah = _.sumBy(
    sekolahMenengah,
    'jumlahPelajar'
  );
  data = [
    ...data,
    { jumlahSekolah: sekolahdata.length, jumlahPelajar: dataPerlis.length },
    {
      jumlahSekolahRendah: sekolahRendah.length,
      jumlahPelajarSekolahRendah: jumlahPelajarSekolahRendah,
      sekolahRendah: sekolahRendah,
    },
    {
      jumlahSekolahMenengah: sekolahMenengah.length,
      jumlahPelajarSekolahMenengah: jumlahPelajarSekolahMenengah,
      sekolahMenengah: sekolahMenengah,
    },
  ];
  res.status(200).json({ data });
};

exports.listPelajarByKodSekolah = (req, res) => {
  const { kodSekolah } = req.query;
  const pelajar = _.filter(dataPerlis, (o) => {
    return o.KODSEKOLAH === kodSekolah;
  });
  const semuaKelasX = _.reduce(
    pelajar,
    (result, value) => {
      result[value.NAMAKELAS] = (result[value.NAMAKELAS] || 0) + 1;
      return result;
    },
    {}
  );
  const semuaKelas = [
    ...new Map(
      pelajar.map((item) => [
        item['NAMAKELAS'],
        {
          darjah: item['THNTING'],
          kelas: item['NAMAKELAS'],
        },
      ])
    ).values(),
  ];
  const pelajarByKelas = [];
  _.forEach(semuaKelas, (item) => {
    const pelajarByKelas2 = _.filter(pelajar, (o) => {
      return o.THNTING === item.kelas;
    });
    pelajarByKelas.push({
      kelas: item.kelas,
      jumlahPelajar: pelajarByKelas2.length,
      pelajar: pelajarByKelas2,
    });
  });
  res.status(200).json({ semuaKelasX });
};

exports.testings = (req, res) => {
  var ListDistinct = [];
  dataPerlis.forEach((m) => {
    if (ListDistinct.indexOf(m.NAMASEKOLAH) < 0)
      ListDistinct.push(m.NAMASEKOLAH, { kod: m.KODSEKOLAH });
  });
  console.log(ListDistinct);
  res.status(200).json({ ListDistinct });
};

exports.sortByKodSekolah = (req, res) => {
  console.log(req.params);
  const { kodSekolah } = req.params;
  let data = [];
  for (let i = 0; i < dataPerlis.length; i++) {
    if (dataPerlis[i].KODSEKOLAH === kodSekolah) {
      data = [...data, dataPerlis[i]];
    }
  }
  res.status(200).json({ data });
};

exports.sortByKodSekolahAndKodKelas = (req, res) => {
  console.log(req.query);
  const { kodSekolah, kodKelas } = req.query;
  let data = [];
  for (let i = 0; i < dataPerlis.length; i++) {
    if (
      dataPerlis[i].KODSEKOLAH === kodSekolah &&
      dataPerlis[i].THNTING === kodKelas
    ) {
      data = [...data, dataPerlis[i]];
    }
  }
  res.status(200).json({ data });
};

exports.showKelasByTahun = (req, res) => {
  const { kodSekolah } = req.params;
  const pelajar = _.filter(dataPerlis, (o) => {
    return o.THNTING === kodSekolah;
  });
  const semuaKelas = [
    ...new Map(
      pelajar.map((item) => [
        item['NAMAKELAS'],
        {
          darjah: item['THNTING'],
          kelas: item['NAMAKELAS'],
        },
      ])
    ).values(),
  ];
  const pelajarByKelas = [];
  _.forEach(semuaKelas, (item) => {
    const pelajarByKelas2 = _.filter(pelajar, (o) => {
      return o.NAMAKELAS === item.kelas && o.THNTING === item.darjah;
    });
    pelajarByKelas.push({
      kelas: item.kelas,
      jumlahPelajar: pelajarByKelas2.length,
      pelajar: pelajarByKelas2,
    });
  });
  res.status(200).json({ pelajarByKelas });
};

exports.showPelajarByKodKelas = (req, res) => {
  const { kodKelas } = req.params;
  const pelajar = _.filter(dataPerlis, (o) => {
    return o.THNTING === kodKelas;
  });
  res.status(200).json({ pelajar });
};
