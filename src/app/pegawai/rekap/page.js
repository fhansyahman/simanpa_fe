'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import RekapPegawai from '@/components/pegawai/pegawairekap';

export default function RekapPegawaiPage() {
  return (
    <ProtectedRoute allowedRoles={['pegawai']}>
          <main>
            <RekapPegawai/>
          </main>
    </ProtectedRoute>
  );
}