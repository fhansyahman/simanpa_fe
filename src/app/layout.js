import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  title: 'SIMANPA -  Sistem Informasi Pemantauan Kinerja Pegawai Non-ASN Wilayah Prajekan Kabupaten Bondowoso ',
  description: ' Sistem Informasi Pemantauan Kinerja Pegawai Non-ASN Wilayah Prajekan Kabupaten Bondowoso',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}