// hooks/rekapterja/useExport.js
"use client";

import { useCallback } from "react";

export function useExport() {
  const exportToExcel = useCallback(async (rekapData, statistik, bulan, tahun, wilayah, getBulanLabel, type = 'presensi') => {
    try {
      // Generate CSV content
      let csv = [];
      
      if (type === 'kinerja') {
        // Header untuk laporan kerja
        csv.push(`"REKAP LAPORAN KERJA BULANAN"`);
        csv.push(`"Periode: ${getBulanLabel(bulan)} ${tahun}"`);
        csv.push(`"Wilayah: ${wilayah || 'Semua Wilayah'}"`);
        csv.push(``);
        csv.push(`"STATISTIK KESELURUHAN"`);
        csv.push(`"Total Pegawai","${statistik.totalPegawai}"`);
        csv.push(`"Total Laporan","${statistik.totalLaporan}"`);
        csv.push(`"Total KR (m)","${statistik.totalKR?.toFixed(2)}"`);
        csv.push(`"Total KN (m)","${statistik.totalKN?.toFixed(2)}"`);
        csv.push(`"Total Panjang (m)","${statistik.totalPanjang?.toFixed(2)}"`);
        csv.push(`"Persentase Kehadiran","${statistik.persenKehadiran}%"`);
        csv.push(``);
        csv.push(`"DETAIL REKAP PER PEGAWAI"`);
        csv.push([`No`, `Nama`, `Jabatan`, `Wilayah`, `Total Laporan`, `Total KR (m)`, `Total KN (m)`, `Total Panjang (m)`, `Kehadiran (%)`].join(','));
        
        rekapData.forEach((item, idx) => {
          csv.push([
            idx + 1,
            `"${item.nama}"`,
            `"${item.jabatan}"`,
            `"${item.wilayah || '-'}"`,
            item.total_laporan,
            item.total_kr?.toFixed(2),
            item.total_kn?.toFixed(2),
            item.total_panjang?.toFixed(2),
            item.persen_kehadiran
          ].join(','));
        });
      } else {
        // Header untuk presensi (existing code)
        // ... keep existing presensi export code
      }
      
      // Download file
      const blob = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', `rekap_${type}_${getBulanLabel(bulan)}_${tahun}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  }, []);

  const handlePrint = useCallback((bulan, tahun, wilayah, getBulanLabel, type = 'presensi') => {
    const printContent = document.getElementById('rekap-table');
    if (!printContent) return;
    
    const originalTitle = document.title;
    document.title = `Rekap_${type}_${getBulanLabel(bulan)}_${tahun}`;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Rekap ${type === 'kinerja' ? 'Laporan Kerja' : 'Kehadiran'} ${getBulanLabel(bulan)} ${tahun}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { color: #333; }
          </style>
        </head>
        <body>
          <h2>Rekap ${type === 'kinerja' ? 'Laporan Kerja' : 'Kehadiran'} Bulanan</h2>
          <p>Periode: ${getBulanLabel(bulan)} ${tahun}</p>
          <p>Wilayah: ${wilayah || 'Semua Wilayah'}</p>
          <hr/>
          ${printContent.outerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    
    document.title = originalTitle;
  }, []);

  return {
    exportToExcel,
    handlePrint
  };
}