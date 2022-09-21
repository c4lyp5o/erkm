const getAge = (birthDateX) => {
  const birthDate = new Date(birthDateX);
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const m = new Date().getMonth() - birthDate.getMonth();
  const value = `${age} tahun, ${m} bulan`;
  return value;
};

console.log(getAge('1995-01-01'));
