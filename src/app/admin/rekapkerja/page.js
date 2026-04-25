"use client";
import ProtectedRoute from '@/components/ProtectedRoute';
import RekapLaporanKerja from '@/components/admin/RekapLaporanKerja';

export default function RekapLaporanKerjaPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <RekapLaporanKerja />
    </ProtectedRoute>
  );
}