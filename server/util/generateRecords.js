module.exports.genRecords = () => {
  const records = [];
  let i = 1;

  while (i <= 200) {
    records.push({
      timestamp: new Date().toISOString(),
      index: i,
    });
    i++;
  }
  return records;
};
