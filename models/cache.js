const mongoose = require('mongoose');

const CacheSchema = new mongoose.Schema(
  {
    // negeri, daerah, kp, operator are associated with each person
    createdByNegeri: { type: String, default: '' },
    createdByDaerah: { type: String, default: '' },
    createdByKp: { type: String, default: '' },
    createdByKodFasiliti: { type: String, default: '' },
    createdByUsername: { type: String, required: true },
    createdByMdcMdtb: { type: String, default: '' },
    // kaunter --------------------------------------------------
    nama: { type: String, trim: true, default: '' },
    jenisIc: { type: String, default: '' },
    ic: { type: String, default: '' },
    nomborTelefon: { type: String, default: '' },
    emel: { type: String, default: '' },
    tarikhLahir: { type: String, default: '' },
    umur: { type: Number, default: 0 },
    umurBulan: { type: Number, default: 0 },
    umurHari: { type: Number, default: 0 },
    jantina: { type: String, default: '' },
    kumpulanEtnik: { type: String, default: '' },
    alamat: { type: String, default: '' },
    daerahAlamat: { type: String, default: '' },
    negeriAlamat: { type: String, default: '' },
    poskodAlamat: { type: String, default: '' },
    ibuMengandung: { type: Boolean, default: false },
    episodeMengandung: { type: String, default: '' },
    bookingIM: { type: String, default: '' },
    mengandungDahGravida: { type: Boolean, default: false },
    orangKurangUpaya: { type: Boolean, default: false },
    bersekolah: { type: Boolean, default: false },
    noOku: { type: String, default: '' },
    statusPesara: { type: String, default: '' },
    noPesara: { type: String, default: '' },
    rujukDaripada: { type: String, default: '' },
    // kepp
    kepp: { type: Boolean, default: false },
    kedatanganKepp: { type: String, default: '' },
    tarikhRujukanKepp: { type: String, default: '' },
    tarikhRundinganPertama: { type: String, default: '' },
    tarikhMulaRawatanKepp: { type: String, default: '' },
    // penyampaian perkhidmatan
    kpBergerak: { type: Boolean, default: false },
    labelKpBergerak: { type: String, default: '' },
    pasukanPergigianBergerak: { type: Boolean, default: false },
    makmalPergigianBergerak: { type: Boolean, default: false },
    labelMakmalPergigianBergerak: { type: String, default: '' },
    // taska / tadika
    fasilitiTaskaTadika: { type: String, default: '' },
    kelasToddler: { type: Boolean, default: false },
    namaFasilitiTaskaTadika: { type: String, default: '' },
    enrolmenTaskaTadika: { type: Boolean, default: false },
    // ipt / kolej
    iptKolej: { type: String, default: '' },
    ipg: { type: String, default: '' },
    kolejKomuniti: { type: String, default: '' },
    politeknik: { type: String, default: '' },
    institutLatihanKerajaan: { type: String, default: '' },
    giatmara: { type: String, default: '' },
    ipta: { type: String, default: '' },
    ipts: { type: String, default: '' },
    enrolmenIptKolej: { type: Boolean, default: false },
    // institusi warga emas
    institusiWargaEmas: { type: String, default: '' },
    kerajaanInstitusiWargaEmas: { type: String, default: '' },
    swastaInstitusiWargaEmas: { type: String, default: '' },
    // institusi OKU
    institusiOku: { type: String, default: '' },
    // kampung angkat
    kgAngkat: { type: String, default: '' },
    // program based
    jenisProgram: { type: String, default: 'NOT APPLICABLE' },
    namaProgram: { type: String, default: 'NOT APPLICABLE' },
    // end of kaunter -------------------------------------------
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cache', CacheSchema);
