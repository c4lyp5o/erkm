const _ = require('lodash');
const { gigaChad } = require('../gigachad');
const dataPerlis = require('../db/erkm.json');
const dataPraPerlis = require('../db/prasekolah.json');
// const pegawai = require('../db/pp.json');
const juruterapi = require('../db/jp.json');
const fasiliti = require('../db/fasiliti.json');
const kkiakd = require('../db/kkiakd.json');
const mysjid = require('../db/mysjid.json');

exports.gigaChad = gigaChad;

exports.getAllFasiliti = (req, res) => {
  const { negeri, daerah, kodFasiliti } = req.query;
  let query = {};
  let data = [];
  if (negeri) {
    query = { ...query, negeri };
  }
  if (daerah) {
    query = { ...query, daerah };
  }
  if (kodFasiliti) {
    query = { ...query, kodFasiliti };
  }
  data = _.filter(fasiliti, query);
  res.status(200).json({ data });
};

exports.getAllPegawai = (req, res) => {
  res.status(200).json(pegawai);
};

exports.queryPegawai = (req, res) => {
  const { nama } = req.query;
  let data = [];
  if (nama) {
    data = _.filter(pegawai, (j) =>
      j.nama.toLowerCase().includes(nama.toLowerCase())
    );
  }
  res.status(200).json({ data });
};

exports.getAllMdtbMembers = (req, res) => {
  res.status(200).json(juruterapi);
};

exports.queryMdtb = (req, res) => {
  const { nama } = req.query;
  let data = [];
  if (nama) {
    data = _.filter(juruterapi, (j) =>
      j.nama.toLowerCase().includes(nama.toLowerCase())
    );
  }
  res.status(200).json({ data });
};

exports.getKkiakd = (req, res) => {
  const { negeri } = req.query;
  let query = {};
  let data = [];
  if (negeri) {
    query = { ...query, negeri };
    data = _.filter(kkiakd, query);
    res.status(200).json(data);
  } else {
    res.status(400).json({ message: 'negeri and daerah are required' });
  }
};

function getStudentsInSchool(schoolName) {
  const students = _.reduce(
    dataPerlis,
    (result, value) => {
      if (value.NAMASEKOLAH === 'SEKOLAH KEBANGSAAN TITI TINGGI') {
        const pelajar = {
          nama: value.NAMA,
          jantina: value.KODJANTINA,
          umur: value.UMUR,
          noKp: value.NOKP,
          tarikhLahir: value.TKHLAHIR,
          kaum: value.KAUM,
          kelas: `${value.THNTING} ${value.NAMAKELAS}`,
        };
        result.murid.push(pelajar);
      }
      return result;
    },
    { murid: [] }
  );
  return students;
}

function getClassesInSchool(students) {
  const classes = students.reduce((result, value) => {
    if (!result.includes(value.kelas)) {
      result.push(value.kelas);
    }
    return result;
  }, []);
  console.log(classes);
  return classes;
}

exports.databaru = (req, res) => {
  res.status(200).json({ dataPerlis });
};

exports.getAllPraSchoolNames = (req, res) => {
  // init keys
  const key1 = 'namasekolah';
  const key2 = 'kodsekolah';
  // 1st pass
  const sekolahdata = [
    ...new Map(
      dataPraPerlis.map((item) => [
        item[key1],
        {
          namaSekolah: item[key1],
          kodSekolah: item[key2],
        },
      ])
    ).values(),
  ];
  res.status(200).json({ data: sekolahdata });
};

exports.getAllSchoolNames = (req, res) => {
  // init array
  let data = [];
  // init keys
  const key1 = 'NAMASEKOLAH';
  const key2 = 'KODSEKOLAH';
  // 1st pass
  const sekolahdata = [
    ...new Map(
      dataPerlis.map((item) => [
        item[key1],
        {
          namaSekolah: item[key1],
          kodSekolah: item[key2],
        },
      ])
    ).values(),
  ];
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
  res.status(200).json(data);
};

exports.getAllPraData = (req, res) => {
  let data = [];
  let ppd = '';
  let ntah = 0;
  const schools = [...new Set(dataPraPerlis.map((item) => item.namasekolah))];
  for (s in schools) {
    const school = schools[s];
    const schoolData = dataPraPerlis.filter(
      (item) => item.namasekolah === school
    );
    const sekolahSemua = [
      ...new Set(schoolData.map((item) => item.namasekolah)),
    ];
    const schoolClasses = [];
    for (s in sekolahSemua) {
      const sekolah = sekolahSemua[s];
      const praData = schoolData.filter((item) => item.namasekolah === sekolah);
      const classes = [...new Set(praData.map((item) => item.nama_kelas))];
      for (c in classes) {
        const classData = praData.filter(
          (item) => item.nama_kelas === classes[c]
        );
        const schoolClass = {
          namaKelas: classes[c],
          pelajar: [],
        };
        for (d in classData) {
          const student = classData[d];
          if (ntah === 0) {
            ppd = student.ppd;
            ntah++;
          }
          schoolClass.pelajar.push({
            NAMA: student.nama,
            KODJANTINA: student.jantina,
            UMUR: student.umur,
            NOKP: student.nomykid,
            TKHLAHIR: student.tarikhlahir,
            KAUM: student.kaum,
          });
        }
        schoolClass.pelajar.sort((a, b) => {
          return a.nama > b.nama ? 1 : -1;
        });
        schoolClasses.push(schoolClass);
      }
    }
    const schoolObject = {
      namaSekolah: school,
      kodSekolah: schoolData[0].kodsekolah,
      kelas: schoolClasses,
    };
    data.push(schoolObject);
  }
  data = [
    {
      DAERAH: 'Perlis',
      PPD: ppd,
      SEKOLAH: [...data],
    },
  ];
  res.status(200).json(data);
};

exports.getAllData = (req, res) => {
  let data = [];
  let daerah = '';
  let ppd = '';
  let ntah = 0;
  const schools = [...new Set(dataPerlis.map((item) => item.NAMASEKOLAH))];
  for (s in schools) {
    const school = schools[s];
    const schoolData = dataPerlis.filter((item) => item.NAMASEKOLAH === school);
    const years = [...new Set(schoolData.map((item) => item.THNTING))];
    const schoolYears = [];
    for (y in years) {
      const year = years[y];
      const yearData = schoolData.filter((item) => item.THNTING === year);
      const classes = [...new Set(yearData.map((item) => item.NAMAKELAS))];
      const schoolClasses = [];
      for (c in classes) {
        const classData = yearData.filter(
          (item) => item.NAMAKELAS === classes[c]
        );
        const schoolClass = {
          namaKelas: classes[c],
          pelajar: [],
        };
        for (d in classData) {
          const student = classData[d];
          if (ntah === 0) {
            daerah = student.DAERAH;
            ppd = student.PPD;
            ntah++;
          }
          schoolClass.pelajar.push({
            NAMA: student.NAMA,
            KODJANTINA: student.KODJANTINA,
            UMUR: student.UMUR,
            NOKP: student.NOKP,
            TKHLAHIR: student.TKHLAHIR,
            KAUM: student.KAUM,
          });
        }
        schoolClass.pelajar.sort((a, b) => {
          return a.NAMA > b.NAMA ? 1 : -1;
        });
        schoolClasses.push(schoolClass);
      }
      const schoolYear = {
        tahun: year,
        kelas: schoolClasses,
      };
      schoolYears.push(schoolYear);
    }
    const schoolObject = {
      namaSekolah: school,
      kodSekolah: schoolData[0].KODSEKOLAH,
      semuaTahun: schoolYears,
    };
    data.push(schoolObject);
  }
  data = [
    {
      DAERAH: daerah,
      PPD: ppd,
      SEKOLAH: [...data],
    },
  ];
  res.status(200).json(data);
};

exports.getAllYears = (req, res) => {
  let data = [];
  let daerah = '';
  let ppd = '';
  let ntah = 0;
  const schools = [...new Set(dataPerlis.map((item) => item.NAMASEKOLAH))];
  for (s in schools) {
    const school = schools[s];
    const schoolData = dataPerlis.filter((item) => item.NAMASEKOLAH === school);
    const years = [...new Set(schoolData.map((item) => item.THNTING))];
    const schoolYears = [];
    for (y in years) {
      const year = years[y];
      const yearData = schoolData.filter((item) => item.THNTING === year);
      const classes = [...new Set(yearData.map((item) => item.NAMAKELAS))];
      const schoolClasses = [];
      for (c in classes) {
        const classData = yearData.filter(
          (item) => item.NAMAKELAS === classes[c]
        );
        daerah = classData[0].DAERAH;
        ppd = classData[0].PPD;
        const schoolClass = {
          namaKelas: classes[c],
        };
        // for (d in classData) {
        //   const student = classData[d];
        //   if (ntah === 0) {
        //     daerah = student.DAERAH;
        //     ppd = student.PPD;
        //     ntah++;
        //   }
        //   schoolClass.pelajar.push({
        //     NAMA: student.NAMA,
        //     KODJANTINA: student.KODJANTINA,
        //     UMUR: student.UMUR,
        //     NOKP: student.NOKP,
        //     TKHLAHIR: student.TKHLAHIR,
        //     KAUM: student.KAUM,
        //   });
        // }
        // schoolClass.pelajar.sort((a, b) => {
        //   return a.NAMA > b.NAMA ? 1 : -1;
        // });
        schoolClasses.push(schoolClass);
      }
      const schoolYear = {
        tahun: year,
        kelas: schoolClasses,
      };
      schoolYears.push(schoolYear);
    }
    const schoolObject = {
      namaSekolah: school,
      kodSekolah: schoolData[0].KODSEKOLAH,
      semuaTahun: schoolYears,
    };
    data.push(schoolObject);
  }
  data = [
    {
      DAERAH: daerah,
      PPD: ppd,
      SEKOLAH: [...data],
    },
  ];
  res.status(200).json(data);
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

exports.sortByKodSekolah = (req, res) => {
  const { kodSekolah } = req.params;
  const data = _.filter(dataPerlis, (o) => {
    return o.KODSEKOLAH === kodSekolah;
  });
  data.sort((a, b) => {
    return a.THNTING - b.THNTING;
  });
  res.status(200).json(data);
};

exports.sortByKodSekolahAndTahun = (req, res) => {
  const { kodSekolah, tahun } = req.params;
  const dataSekolah = dataPerlis.filter(
    (item) => item.KODSEKOLAH === kodSekolah
  );
  const data = dataSekolah.filter((item) => item.THNTING === tahun);
  data.sort((a, b) => {
    return a.NAMA > b.NAMA ? 1 : -1;
  });
  res.status(200).json(data);
};

exports.sortByKodSekolahAndTahunAndKelas = (req, res) => {
  const { kodSekolah, tahun, kelas } = req.params;
  const dataSekolah = dataPerlis.filter(
    (item) => item.KODSEKOLAH === kodSekolah
  );
  const dataSekolahTahun = dataSekolah.filter((item) => item.THNTING === tahun);
  const data = dataSekolahTahun.filter((item) => item.NAMAKELAS === kelas);
  data.sort((a, b) => {
    return a.NAMA > b.NAMA ? 1 : -1;
  });
  res.status(200).json(data);
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

exports.checkTheirID = (req, res) => {
  const { pid } = req.query;
  console.log(pid);
  const verified = _.filter(mysjid, (o) => {
    return o.pid === pid;
  });
  if (verified.length > 0) {
    res.status(200).json({ verified: true, info: verified[0] });
  } else {
    res.status(200).json({ verified: false });
  }
};
