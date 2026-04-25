'use client';

import ProtectedRoute from "@/components/ProtectedRoute";
import PenugasanRoute from "@/components/admin/adminpenugasan";

export default function PenugasanPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PenugasanRoute />
    </ProtectedRoute>
  );
}