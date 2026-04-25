'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import RekapLaporanKerja from '@/components/atasan/RekapLaporanKerja';
export default function RekapLaporanKerjaPage() {
  return (
    <ProtectedRoute allowedRoles={['atasan']}>
      <RekapLaporanKerja />
    </ProtectedRoute>
  );
}   