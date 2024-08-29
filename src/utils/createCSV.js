//learn from this post https://stackoverflow.com/a/47118892
// for get the file in emulator
// adb pull <export-filepath> <destination-filepath>
//adb pull /storage/emulated/0/Download/testing2222024_08_29_07_28.csv C:\Users\Lenovo\Desktop

import RNFetchBlob from 'rn-fetch-blob';

const _convertRowString = data => {
  const rows = data.map(row => {
    let columns = '';
    for (key in row) {
      columns += row[key] + ',';
    }
    return (columns += '\n');
  });

  return rows.join('');
};

export const createCSV = async (data, headers, filename) => {
  try {
    const headerString = `${headers.join(',')}\n`;
    const rowString = _convertRowString(data);
    const csvString = `${headerString}${rowString}`;
    const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/${filename}.csv`;
  
    if (!csvString || !pathToWrite) return { success: false, destination: null };
    await RNFetchBlob.fs.writeFile(pathToWrite, csvString, 'utf8');
    console.log(`wrote file ${pathToWrite}`);
    return { success: true, destination: pathToWrite };
  } catch (error) {
    console.error(error);
    return { success: false, destination: null };
  }
};