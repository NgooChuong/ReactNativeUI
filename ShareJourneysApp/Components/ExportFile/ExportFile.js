import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Button, View } from 'react-native';

// expo add expo-file-system expo-sharing xlsx
import * as XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function exportFile (data) {
  const rows = data.map((item, index) => [
    index + 1, // STT
    item.Companion.user.username, // Ho Ten
    item.diaChiDon.diaChi, // DiemDi
    item.diaChiDen.diaChi // DiemDen
]);

// Tạo workbook mới
let wb = XLSX.utils.book_new();

// Tạo worksheet từ mảng 2 chiều
let ws = XLSX.utils.aoa_to_sheet([
    ["STT", "Ho Ten", "DiemDi", "DiemDen"],
    ...rows
]);

ws['!cols'] = [
  { wch: 5 }, // Độ rộng cột "STT"
  { wch: 20 }, // Độ rộng cột "Ho Ten"
  { wch: 10 }, // Độ rộng cột "DiemDi"
  { wch: 10 } // Độ rộng cột "DiemDen"
];

    XLSX.utils.book_append_sheet(wb, ws, "Danh sach nguoi di cung", true);

    const base64 = XLSX.write(wb, { type: "base64" });
    const filename = FileSystem.documentDirectory + "DS_NguoiDiCung.xlsx";
    console.log("fi",filename);
    FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64
    }).then(() => {
      Sharing.shareAsync(filename);
    });


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});