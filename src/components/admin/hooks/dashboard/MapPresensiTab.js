"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  MapPin, Users, Navigation, Search, X, Clock, 
  Loader2, RefreshCw, Calendar, ChevronLeft, ChevronRight, AlertCircle,
  Home, Briefcase, UserCheck, UserX, Map as MapIcon, Route
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import Swal from "sweetalert2";

export function MapPresensiTab({ selectedDate, onDateChange }) {
  const [presensiList, setPresensiList] = useState([]);
  const [allPresensiData, setAllPresensiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPresensi, setSelectedPresensi] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterWilayah, setFilterWilayah] = useState("");
  const [filterTanggal, setFilterTanggal] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [wilayahList, setWilayahList] = useState([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showRoutes, setShowRoutes] = useState(true);
  const [routeOpacity, setRouteOpacity] = useState(0.7);
  const [showDistanceLabels, setShowDistanceLabels] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    denganLokasiMasuk: 0,
    denganLokasiPulang: 0,
    hadir: 0,
    terlambat: 0,
    izin: 0,
    tanpaKeterangan: 0,
    totalJarakTempuh: 0,
    rataRataJarak: 0
  });
  
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const leafletRef = useRef(null);
  const routeLayerRef = useRef(null);
  const distanceLabelLayerRef = useRef(null);

  // Load Leaflet hanya di client side
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');
        
        leafletRef.current = L;
        
        // Fix untuk icon Leaflet
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        });
        
        setIsMapReady(true);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };
    
    loadLeaflet();
  }, []);

  // Update filter tanggal ketika selectedDate berubah dari props
  useEffect(() => {
    if (selectedDate) {
      setFilterTanggal(selectedDate);
    }
  }, [selectedDate]);

  // Fungsi untuk mengambil data presensi
  const fetchPresensiData = useCallback(async (tanggal) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📅 Mengambil data presensi untuk tanggal: ${tanggal}`);
      
      // Gunakan dashboardService yang sudah ada
      const response = await dashboardService.getPresensiHarian(tanggal);
      
      console.log('✅ Response dari API:', response);

      // Handle response dari dashboardService
      const allData = response?.data?.data || response?.data || [];
      setAllPresensiData(allData);
      console.log(`📊 Total data dari API: ${allData.length} records`);
      
      // Filter data yang memiliki koordinat
      const dataWithLocation = allData.filter(item => {
        const hasLatMasuk = item.latitude_masuk && item.latitude_masuk !== 0;
        const hasLngMasuk = item.longitude_masuk && item.longitude_masuk !== 0;
        const hasLatPulang = item.latitude_pulang && item.latitude_pulang !== 0;
        const hasLngPulang = item.longitude_pulang && item.longitude_pulang !== 0;
        
        return (hasLatMasuk && hasLngMasuk) || (hasLatPulang && hasLngPulang);
      });

      console.log(`📍 Data dengan lokasi: ${dataWithLocation.length} records`);

      // Format data untuk ditampilkan di peta
      const formattedData = [];
      const lokasiYangDigunakan = new Set();
      
      dataWithLocation.forEach(item => {
        // Entry untuk presensi masuk
        if (item.latitude_masuk && item.longitude_masuk) {
          const key = `${item.user_id || item.pegawai_id}-${item.tanggal}-masuk`;
          if (!lokasiYangDigunakan.has(key)) {
            formattedData.push({
              id: `${item.id}-masuk`,
              presensi_id: item.id,
              user_id: item.user_id || item.pegawai_id,
              nama: item.nama,
              jabatan: item.jabatan,
              wilayah_penugasan: item.wilayah_penugasan,
              tanggal: item.tanggal,
              jam: item.jam_masuk,
              status: item.status_masuk,
              jenis: 'masuk',
              lat: parseFloat(item.latitude_masuk),
              lng: parseFloat(item.longitude_masuk),
              foto: item.foto_masuk,
              is_lembur: item.is_lembur,
              izin_id: item.izin_id
            });
            lokasiYangDigunakan.add(key);
          }
        }
        
        // Entry untuk presensi pulang
        if (item.latitude_pulang && item.longitude_pulang) {
          const key = `${item.user_id || item.pegawai_id}-${item.tanggal}-pulang`;
          if (!lokasiYangDigunakan.has(key)) {
            formattedData.push({
              id: `${item.id}-pulang`,
              presensi_id: item.id,
              user_id: item.user_id || item.pegawai_id,
              nama: item.nama,
              jabatan: item.jabatan,
              wilayah_penugasan: item.wilayah_penugasan,
              tanggal: item.tanggal,
              jam: item.jam_pulang,
              status: item.status_pulang,
              jenis: 'pulang',
              lat: parseFloat(item.latitude_pulang),
              lng: parseFloat(item.longitude_pulang),
              foto: item.foto_pulang,
              is_lembur: item.is_lembur,
              izin_id: item.izin_id
            });
            lokasiYangDigunakan.add(key);
          }
        }
      });

      setPresensiList(formattedData);
      
      // Hitung statistik
      const hadir = allData.filter(p => p.status_masuk === 'Tepat Waktu').length;
      const terlambat = allData.filter(p => p.status_masuk === 'Terlambat').length;
      const izin = allData.filter(p => p.izin_id !== null).length;
      const tanpaKeterangan = allData.filter(p => 
        p.izin_id === null && !p.jam_masuk
      ).length;
      
      const denganLokasiMasuk = allData.filter(p => 
        p.latitude_masuk && p.longitude_masuk
      ).length;
      
      const denganLokasiPulang = allData.filter(p => 
        p.latitude_pulang && p.longitude_pulang
      ).length;

      // Extract wilayah unik
      const uniqueWilayah = [...new Set(allData.map(p => p.wilayah_penugasan))].filter(Boolean);
      setWilayahList(uniqueWilayah);

      setStats(prev => ({
        ...prev,
        total: allData.length,
        denganLokasiMasuk,
        denganLokasiPulang,
        hadir,
        terlambat,
        izin,
        tanpaKeterangan
      }));
      
    } catch (err) {
      console.error('❌ Error fetching presensi:', err);
      setError(err.message || 'Gagal memuat data presensi');
      setPresensiList([]);
      setStats({
        total: 0,
        denganLokasiMasuk: 0,
        denganLokasiPulang: 0,
        hadir: 0,
        terlambat: 0,
        izin: 0,
        tanpaKeterangan: 0,
        totalJarakTempuh: 0,
        rataRataJarak: 0
      });
      
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Data',
        text: err.message || 'Terjadi kesalahan saat mengambil data presensi',
        confirmButtonText: 'Oke'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data ketika tanggal berubah
  useEffect(() => {
    if (filterTanggal) {
      fetchPresensiData(filterTanggal);
    }
  }, [filterTanggal, fetchPresensiData]);

  // Inisialisasi map
  useEffect(() => {
    if (!isMapReady || !mapRef.current || mapInstanceRef.current || !leafletRef.current) return;

    const L = leafletRef.current;

    const map = L.map(mapRef.current).setView([-7.919021, 113.820801], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    mapInstanceRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    distanceLabelLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isMapReady]);

  // Fungsi untuk menghitung jarak antara dua titik (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Fungsi untuk membuat garis route antara dua titik
  const createRouteLine = (startLat, startLng, endLat, endLng, color, distance) => {
    const L = leafletRef.current;
    if (!L) return null;
    
    // Buat garis dengan panah (menggunakan polyline decorator)
    const routeLine = L.polyline(
      [[startLat, startLng], [endLat, endLng]],
      {
        color: color,
        weight: 3,
        opacity: routeOpacity,
        dashArray: '5, 8',
        className: 'route-line'
      }
    );
    
    return routeLine;
  };

  // Fungsi untuk membuat label jarak di tengah garis
  const createDistanceLabel = (startLat, startLng, endLat, endLng, distance, nama) => {
    const L = leafletRef.current;
    if (!L) return null;
    
    const midLat = (startLat + endLat) / 2;
    const midLng = (startLng + endLng) / 2;
    
    // Hitung sudut untuk rotasi label (opsional)
    const angle = Math.atan2(endLat - startLat, endLng - startLng) * 180 / Math.PI;
    
    const labelDiv = L.divIcon({
      className: 'distance-label',
      html: `
        <div class="distance-label-content" style="transform: rotate(${angle}deg);">
          <div class="distance-value">${distance.toFixed(2)} km</div>
          <div class="distance-name">${nama || ''}</div>
        </div>
      `,
      iconSize: [80, 40],
      iconAnchor: [40, 20]
    });
    
    return L.marker([midLat, midLng], { icon: labelDiv, interactive: false });
  };

  // Fungsi untuk mengelompokkan data berdasarkan user
  const groupPresensiByUser = (data) => {
    const grouped = {};
    
    data.forEach(item => {
      const key = `${item.user_id}-${item.tanggal}`;
      if (!grouped[key]) {
        grouped[key] = {
          user_id: item.user_id,
          nama: item.nama,
          tanggal: item.tanggal,
          wilayah: item.wilayah_penugasan,
          masuk: null,
          pulang: null
        };
      }
      
      if (item.jenis === 'masuk') {
        grouped[key].masuk = item;
      } else if (item.jenis === 'pulang') {
        grouped[key].pulang = item;
      }
    });
    
    return Object.values(grouped).filter(item => item.masuk && item.pulang);
  };

  // Update markers dan routes ketika data berubah
  useEffect(() => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    
    if (!map || !markerLayerRef.current || !L || !isMapReady) return;

    // Hapus semua marker lama
    markerLayerRef.current.clearLayers();
    
    // Hapus routes dan labels lama
    if (routeLayerRef.current) {
      routeLayerRef.current.clearLayers();
    }
    if (distanceLabelLayerRef.current) {
      distanceLabelLayerRef.current.clearLayers();
    }

    // Filter data berdasarkan search dan wilayah untuk peta
    const filteredData = presensiList.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jabatan?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesWilayah = filterWilayah === '' || item.wilayah_penugasan === filterWilayah;
      
      return matchesSearch && matchesWilayah;
    });

    if (filteredData.length === 0) {
      // Jika tidak ada data, tampilkan marker default
      const defaultIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-pin bg-gray-400">
            <span class="marker-text">📍</span>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      L.marker([-7.919021, 113.820801], { icon: defaultIcon })
        .bindPopup('Pusat Wilayah Prajekan')
        .addTo(markerLayerRef.current);
      
      return;
    }

    // Group data berdasarkan user untuk membuat route
    const groupedByUser = groupPresensiByUser(filteredData);
    
    // Hitung statistik jarak
    let totalJarak = 0;
    let jumlahRoute = 0;
    
    // Buat route lines
    if (showRoutes) {
      groupedByUser.forEach(userData => {
        if (userData.masuk && userData.pulang) {
          const distance = calculateDistance(
            userData.masuk.lat, userData.masuk.lng,
            userData.pulang.lat, userData.pulang.lng
          );
          
          totalJarak += distance;
          jumlahRoute++;
          
          // Pilih warna berdasarkan jarak
          let routeColor = '#10b981'; // Hijau untuk jarak dekat (< 5km)
          if (distance > 10) routeColor = '#ef4444'; // Merah untuk jarak jauh (> 10km)
          else if (distance > 5) routeColor = '#f59e0b'; // Kuning untuk jarak sedang (5-10km)
          
          const routeLine = createRouteLine(
            userData.masuk.lat, userData.masuk.lng,
            userData.pulang.lat, userData.pulang.lng,
            routeColor,
            distance
          );
          
          if (routeLine) {
            routeLine.addTo(routeLayerRef.current);
            
            // Tambahkan tooltip untuk menampilkan jarak saat hover
            routeLine.bindTooltip(`${userData.nama}: ${distance.toFixed(2)} km`, {
              permanent: false,
              direction: 'center',
              className: 'route-tooltip'
            });
            
            // Tambahkan label jarak di tengah route
            if (showDistanceLabels) {
              const label = createDistanceLabel(
                userData.masuk.lat, userData.masuk.lng,
                userData.pulang.lat, userData.pulang.lng,
                distance,
                userData.nama
              );
              if (label) {
                label.addTo(distanceLabelLayerRef.current);
              }
            }
          }
        }
      });
    }
    
    // Update statistik jarak
    setStats(prev => ({
      ...prev,
      totalJarakTempuh: totalJarak,
      rataRataJarak: jumlahRoute > 0 ? totalJarak / jumlahRoute : 0
    }));

    // Buat marker untuk setiap data
    filteredData.forEach(item => {
      if (!item.lat || !item.lng) return;

      const markerColor = getMarkerColor(item);
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-pin ${markerColor}">
            <span class="marker-text">${item.jenis === 'masuk' ? 'M' : 'P'}</span>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
      });

      // Cari pasangan untuk menampilkan info jarak
      const pair = groupedByUser.find(u => 
        (u.masuk?.id === item.id || u.pulang?.id === item.id)
      );
      
      let distanceInfo = '';
      if (pair && pair.masuk && pair.pulang) {
        const distance = calculateDistance(
          pair.masuk.lat, pair.masuk.lng,
          pair.pulang.lat, pair.pulang.lng
        );
        distanceInfo = `
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span>📏</span>
              <div>
                <div style="font-weight: 600;">Jarak Tempuh</div>
                <div>${distance.toFixed(2)} km</div>
              </div>
            </div>
          </div>
        `;
      }

      const popupContent = `
        <div style="min-width: 280px; padding: 8px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #3b82f6; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
              ${item.nama?.charAt(0) || 'P'}
            </div>
            <div>
              <div style="font-weight: bold; color: #1a202c;">${item.nama || 'Tanpa Nama'}</div>
              <div style="font-size: 11px; color: #64748b;">${item.jabatan || '-'}</div>
            </div>
          </div>
          
          <div style="background: #f8fafc; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span style="background: ${item.jenis === 'masuk' ? '#3b82f6' : '#10b981'}; color: white; padding: 2px 6px; border-radius: 12px; font-size: 10px; font-weight: bold;">
                ${item.jenis === 'masuk' ? '⤴️ MASUK' : '⤵️ PULANG'}
              </span>
              <span style="font-size: 11px; color: #475569;">${item.jam ? item.jam.substring(0,5) : '-'}</span>
            </div>
            
            <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
              <strong>Status:</strong> ${getStatusText(item)}
            </div>
            
            <div style="font-size: 11px; color: #475569;">
              <strong>Wilayah:</strong> ${item.wilayah_penugasan}
            </div>
          </div>
          
          ${distanceInfo}
          
          <div style="font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <div>ID: ${item.presensi_id}</div>
            <div>Waktu: ${new Date(item.tanggal).toLocaleDateString('id-ID')} ${item.jam ? item.jam.substring(0,5) : ''}</div>
          </div>
        </div>
      `;

      const marker = L.marker([item.lat, item.lng], { icon: customIcon })
        .bindPopup(popupContent)
        .on('click', () => setSelectedPresensi(item));

      markerLayerRef.current.addLayer(marker);
    });

    // Adjust bounds ke semua marker dan route
    const allPoints = [...filteredData.map(p => [p.lat, p.lng])];
    if (showRoutes && groupedByUser.length > 0) {
      groupedByUser.forEach(user => {
        if (user.masuk && user.pulang) {
          allPoints.push([user.masuk.lat, user.masuk.lng]);
          allPoints.push([user.pulang.lat, user.pulang.lng]);
        }
      });
    }
    
    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.flyToBounds(bounds, { padding: [50, 50] });
    }

  }, [presensiList, searchTerm, filterWilayah, isMapReady, showRoutes, routeOpacity, showDistanceLabels]);

  // Helper functions
  const getMarkerColor = (item) => {
    if (item.jenis === 'masuk') {
      return item.status === 'Terlambat' ? 'bg-yellow-500' : 'bg-blue-500';
    } else {
      return item.is_lembur ? 'bg-purple-500' : 'bg-green-500';
    }
  };

  const getStatusText = (item) => {
    if (item.izin_id) return 'Izin';
    if (!item.jam) return 'Belum Presensi';
    if (item.status === 'Terlambat') return 'Terlambat';
    if (item.status === 'Tepat Waktu') return 'Tepat Waktu';
    return item.status || 'Presensi';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Tepat Waktu':
        return 'bg-green-100 text-green-800';
      case 'Terlambat':
        return 'bg-yellow-100 text-yellow-800';
      case 'Izin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTanggal = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return date;
    }
  };

  const handlePrevDay = () => {
    if (!filterTanggal) return;
    const date = new Date(filterTanggal);
    date.setDate(date.getDate() - 1);
    const newDate = date.toISOString().split('T')[0];
    setFilterTanggal(newDate);
    if (onDateChange) {
      onDateChange({ target: { value: newDate } });
    }
  };

  const handleNextDay = () => {
    if (!filterTanggal) return;
    const date = new Date(filterTanggal);
    date.setDate(date.getDate() + 1);
    const newDate = date.toISOString().split('T')[0];
    setFilterTanggal(newDate);
    if (onDateChange) {
      onDateChange({ target: { value: newDate } });
    }
  };

  const handleToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setFilterTanggal(today);
    if (onDateChange) {
      onDateChange({ target: { value: today } });
    }
  };

  const handleRefresh = () => {
    if (filterTanggal) {
      fetchPresensiData(filterTanggal);
    }
  };

  const handleLocateUser = () => {
    if (!mapInstanceRef.current || !leafletRef.current) return;
    
    const L = leafletRef.current;
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          mapInstanceRef.current.flyTo(
            [position.coords.latitude, position.coords.longitude], 
            15
          );
          
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: '<div style="width: 20px; height: 20px; background: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(59,130,246,0.5);"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          L.marker([position.coords.latitude, position.coords.longitude], { icon: userIcon })
            .bindPopup('Lokasi Anda')
            .addTo(mapInstanceRef.current);
        },
        (error) => {
          console.error("Error getting location:", error);
          Swal.fire({
            icon: 'warning',
            title: 'Gagal Mendapatkan Lokasi',
            text: 'Pastikan izin lokasi diaktifkan',
            confirmButtonText: 'Oke'
          });
        }
      );
    }
  };

  const resetView = () => {
    const map = mapInstanceRef.current;
    const L = leafletRef.current;
    
    if (!map || presensiList.length === 0 || !L) {
      map?.setView([-7.919021, 113.820801], 11);
      return;
    }
    
    // Filter data yang memiliki lokasi
    const dataWithLocation = presensiList.filter(p => p.lat && p.lng);
    if (dataWithLocation.length > 0) {
      const bounds = L.latLngBounds(dataWithLocation.map(p => [p.lat, p.lng]));
      map.flyToBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([-7.919021, 113.820801], 11);
    }
    setSelectedPresensi(null);
  };

  const focusToWilayah = (wilayah) => {
    setFilterWilayah(wilayah);
    setSearchTerm('');
  };

  // Filter untuk sidebar
  const filteredPresensiForSidebar = allPresensiData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jabatan?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesWilayah = filterWilayah === '' || item.wilayah_penugasan === filterWilayah;
    
    return matchesSearch && matchesWilayah;
  });

  // Filter untuk stats berdasarkan wilayah yang dipilih
  const filteredStats = {
    total: filteredPresensiForSidebar.length,
    denganLokasiMasuk: filteredPresensiForSidebar.filter(p => 
      p.latitude_masuk && p.longitude_masuk
    ).length,
    denganLokasiPulang: filteredPresensiForSidebar.filter(p => 
      p.latitude_pulang && p.longitude_pulang
    ).length,
    hadir: filteredPresensiForSidebar.filter(p => p.status_masuk === 'Tepat Waktu').length,
    terlambat: filteredPresensiForSidebar.filter(p => p.status_masuk === 'Terlambat').length,
    izin: filteredPresensiForSidebar.filter(p => p.izin_id !== null).length,
    tanpaKeterangan: filteredPresensiForSidebar.filter(p => 
      p.izin_id === null && !p.jam_masuk
    ).length
  };

  if (loading && !isMapReady) {
    return (
      <div className="min-h-[600px] bg-gray-50 flex items-center justify-center rounded-xl">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Memuat data presensi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin size={24} />
            <div>
              <h1 className="text-xl font-bold">Peta Monitoring Presensi</h1>
              <p className="text-sm text-blue-100">Pemantauan lokasi real-time pegawai</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Filter Tanggal */}
        <div className="flex flex-wrap items-center gap-3 bg-blue-500/20 p-3 rounded-lg">
          <Calendar size={20} className="text-blue-200" />
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevDay}
              className="p-1 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg"
            >
              <ChevronLeft size={18} />
            </button>
            
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => {
                setFilterTanggal(e.target.value);
                if (onDateChange) {
                  onDateChange(e);
                }
              }}
              className="px-3 py-1.5 bg-white text-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <button
              onClick={handleNextDay}
              className="p-1 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg"
            >
              <ChevronRight size={18} />
            </button>
            
            <button
              onClick={handleToday}
              className="px-3 py-1.5 bg-blue-500/30 hover:bg-blue-500/50 rounded-lg text-sm ml-2"
            >
              Hari Ini
            </button>
          </div>

          {/* Info Statistik dengan Filter Wilayah */}
          <div className="flex items-center gap-4 ml-auto text-sm">
            <span className="flex items-center gap-1">
              <UserCheck size={14} />
              Hadir: {filteredStats.hadir}
            </span>
            <span className="flex items-center gap-1 text-yellow-200">
              <Clock size={14} />
              Terlambat: {filteredStats.terlambat}
            </span>
            <span className="flex items-center gap-1 text-purple-200">
              <Briefcase size={14} />
              Izin: {filteredStats.izin}
            </span>
            <span className="flex items-center gap-1 text-gray-300">
              <UserX size={14} />
              Tanpa Ket: {filteredStats.tanpaKeterangan}
            </span>
          </div>
        </div>

        {/* Info Lokasi */}
        {filteredStats.denganLokasiMasuk === 0 && filteredStats.denganLokasiPulang === 0 && (
          <div className="mt-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-200">
              <AlertCircle size={18} />
              <p className="text-sm">
                Tidak ada data lokasi untuk filter ini. Data lokasi hanya tersedia jika pegawai melakukan presensi dengan GPS.
              </p>
            </div>
          </div>
        )}

        {/* Quick Filter Wilayah */}
        {wilayahList.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-blue-200">Filter Wilayah:</span>
            <button
              onClick={() => setFilterWilayah('')}
              className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                filterWilayah === '' 
                  ? 'bg-white text-blue-600' 
                  : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
              }`}
            >
              Semua ({allPresensiData.length})
            </button>
            {wilayahList.map(wilayah => {
              const count = allPresensiData.filter(p => p.wilayah_penugasan === wilayah).length;
              return (
                <button
                  key={wilayah}
                  onClick={() => {
                    setFilterWilayah(wilayah === filterWilayah ? '' : wilayah);
                    setSearchTerm('');
                  }}
                  className={`px-2 py-1 rounded-lg text-xs transition-colors ${
                    filterWilayah === wilayah 
                      ? 'bg-white text-blue-600' 
                      : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
                  }`}
                >
                  {wilayah} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => fetchPresensiData(filterTanggal)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Map dan Sidebar */}
      {isMapReady && (
        <div className="flex flex-col lg:flex-row p-4 gap-4">
          {/* Sidebar Kiri - Daftar Pegawai */}
          <div className="lg:w-96 bg-white rounded-xl shadow-lg overflow-hidden flex flex-col border border-gray-200">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Cari pegawai..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Info Tanggal & Filter */}
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
              <p className="text-sm text-blue-700">
                <Calendar size={14} className="inline mr-1" />
                {formatTanggal(filterTanggal)}
              </p>
              {filterWilayah && (
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                  <MapPin size={12} />
                  Menampilkan wilayah: {filterWilayah}
                  <button
                    onClick={() => setFilterWilayah('')}
                    className="ml-2 text-blue-400 hover:text-blue-600"
                  >
                    <X size={12} />
                  </button>
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 text-black">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Masuk</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Pulang</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Terlambat</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Lembur</span>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <div className="w-6 h-0.5 bg-red-500" style={{ borderTop: '2px dashed #ef4444' }}></div>
                  <span>Route (&gt;10km)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-0.5 bg-yellow-500" style={{ borderTop: '2px dashed #f59e0b' }}></div>
                  <span>Route (5-10km)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-0.5 bg-green-500" style={{ borderTop: '2px dashed #10b981' }}></div>
                  <span>Route (&lt;5km)</span>
                </div>
              </div>
            </div>

            {/* Route Controls */}
            <div className="px-4 py-3 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Route size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Garis Rute Perjalanan</span>
                </div>
                <button
                  onClick={() => setShowRoutes(!showRoutes)}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    showRoutes 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {showRoutes ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
              
              {showRoutes && (
                <div className="space-y-2 mt-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Opacity Route</label>
                    <input
                      type="range"
                      min="0.2"
                      max="1"
                      step="0.05"
                      value={routeOpacity}
                      onChange={(e) => setRouteOpacity(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-500 flex items-center gap-1">
                      <MapIcon size={12} />
                      Tampilkan Label Jarak
                    </label>
                    <button
                      onClick={() => setShowDistanceLabels(!showDistanceLabels)}
                      className={`w-8 h-4 rounded-full transition-colors ${
                        showDistanceLabels ? 'bg-blue-600' : 'bg-gray-300'
                      } relative`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                        showDistanceLabels ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Statistik Jarak */}
              {stats.totalJarakTempuh > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Total Jarak Tempuh:</span>
                      <span className="font-semibold text-blue-600">{stats.totalJarakTempuh.toFixed(2)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rata-rata Jarak:</span>
                      <span className="font-semibold text-green-600">{stats.rataRataJarak.toFixed(2)} km</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {filteredPresensiForSidebar.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Tidak ada data presensi</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {filterWilayah 
                      ? `untuk wilayah ${filterWilayah} pada tanggal ${filterTanggal}`
                      : `untuk tanggal ${filterTanggal}`}
                  </p>
                  {filterWilayah && (
                    <button
                      onClick={() => setFilterWilayah('')}
                      className="mt-3 text-xs text-blue-600 hover:text-blue-700"
                    >
                      Hapus filter wilayah
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredPresensiForSidebar.map(item => {
                    const hasLocation = (item.latitude_masuk && item.longitude_masuk) || 
                                       (item.latitude_pulang && item.longitude_pulang);
                    
                    // Hitung jarak jika ada kedua lokasi
                    let jarakTempuh = null;
                    if (item.latitude_masuk && item.longitude_masuk && 
                        item.latitude_pulang && item.longitude_pulang) {
                      jarakTempuh = calculateDistance(
                        parseFloat(item.latitude_masuk), parseFloat(item.longitude_masuk),
                        parseFloat(item.latitude_pulang), parseFloat(item.longitude_pulang)
                      );
                    }
                    
                    return (
                      <div
                        key={item.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          const lat = item.latitude_masuk || item.latitude_pulang;
                          const lng = item.longitude_masuk || item.longitude_pulang;
                          if (lat && lng && mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo([parseFloat(lat), parseFloat(lng)], 16);
                            setSelectedPresensi({
                              nama: item.nama,
                              jabatan: item.jabatan,
                              wilayah_penugasan: item.wilayah_penugasan,
                              tanggal: item.tanggal,
                              jam: item.jam_masuk || item.jam_pulang,
                              status: item.status_masuk || item.status_pulang,
                              jenis: item.latitude_masuk ? 'masuk' : 'pulang',
                              presensi_id: item.id
                            });
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold
                            ${item.status_masuk === 'Tepat Waktu' ? 'bg-green-500' : 
                              item.status_masuk === 'Terlambat' ? 'bg-yellow-500' :
                              item.izin_id ? 'bg-purple-500' : 'bg-gray-400'}`}>
                            {item.nama?.charAt(0) || 'P'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">
                              {item.nama}
                              {!hasLocation && (
                                <span className="ml-2 text-xs text-gray-400">(tanpa lokasi)</span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span>{item.wilayah_penugasan || 'Unknown'}</span>
                              <span>•</span>
                              <span>{item.jam_masuk ? item.jam_masuk.substring(0,5) : 
                                     item.jam_pulang ? item.jam_pulang.substring(0,5) : 'Belum presensi'}</span>
                              {jarakTempuh && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-600">📏 {jarakTempuh.toFixed(1)} km</span>
                                </>
                              )}
                            </div>
                          </div>
                          {hasLocation && (
                            <MapPin size={14} className="text-blue-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 text-black">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">Total Pegawai:</span>
                  <span className="ml-2 font-semibold">{filteredStats.total}</span>
                </div>
                <div>
                  <span className="text-gray-500">Dengan Lokasi:</span>
                  <span className="ml-2 font-semibold text-blue-600">
                    {filteredStats.denganLokasiMasuk + filteredStats.denganLokasiPulang}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Route Aktif:</span>
                  <span className="ml-2 font-semibold text-green-600">
                    {showRoutes ? 'Ya' : 'Tidak'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Total Jarak:</span>
                  <span className="ml-2 font-semibold text-orange-600">
                    {stats.totalJarakTempuh.toFixed(1)} km
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden relative h-[650px] border border-gray-200">
            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={handleLocateUser}
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Lokasi Saya"
              >
                <Navigation size={20} className="text-blue-600" />
              </button>
              <button
                onClick={resetView}
                className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                title="Reset View"
              >
                <Home size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Info Panel Atas */}
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
              <p className="text-sm font-medium text-gray-700">
                {presensiList.filter(item => {
                  const matchesSearch = searchTerm === '' || 
                    item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.jabatan?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesWilayah = filterWilayah === '' || item.wilayah_penugasan === filterWilayah;
                  return matchesSearch && matchesWilayah;
                }).length} Lokasi Ditampilkan
              </p>
              {filterWilayah && (
                <p className="text-xs text-blue-600 mt-1">
                  Filter: {filterWilayah}
                </p>
              )}
              {searchTerm && (
                <p className="text-xs text-gray-500 mt-1">
                  Pencarian: "{searchTerm}"
                </p>
              )}
              {showRoutes && stats.totalJarakTempuh > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  🛣️ Total Route: {stats.totalJarakTempuh.toFixed(1)} km
                </p>
              )}
            </div>

            {/* Map Container */}
            <div ref={mapRef} className="w-full h-full" />

            {/* Selected Item Info */}
            {selectedPresensi && (
              <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-80 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                      ${selectedPresensi.jenis === 'masuk' ? 'bg-blue-500' : 'bg-green-500'}`}>
                      {selectedPresensi.jenis === 'masuk' ? 'M' : 'P'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{selectedPresensi.nama}</h3>
                      <p className="text-xs text-gray-500">{selectedPresensi.jabatan}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedPresensi(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Waktu:</span>
                    <span className="font-medium">
                      {new Date(selectedPresensi.tanggal).toLocaleDateString('id-ID')} {selectedPresensi.jam?.substring(0,5) || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Wilayah:</span>
                    <span>{selectedPresensi.wilayah_penugasan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(selectedPresensi.status)}`}>
                      {getStatusText(selectedPresensi)}
                    </span>
                  </div>
                  <div className="text-gray-400 pt-2 mt-2 border-t border-gray-100">
                    <div>ID Presensi: {selectedPresensi.presensi_id}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .marker-pin {
          width: 30px;
          height: 30px;
          border-radius: 50% 50% 50% 0;
          position: relative;
          transform: rotate(-45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-pin.bg-blue-500 { background: #3b82f6; }
        .marker-pin.bg-green-500 { background: #10b981; }
        .marker-pin.bg-yellow-500 { background: #f59e0b; }
        .marker-pin.bg-purple-500 { background: #8b5cf6; }
        .marker-pin.bg-gray-400 { background: #9ca3af; }
        .marker-text {
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 12px;
        }
        
        /* Style untuk route line */
        .route-line {
          stroke-linecap: round;
          animation: dash 20s linear infinite;
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        
        /* Style untuk distance label */
        .distance-label {
          background: transparent !important;
          border: none !important;
        }
        
        .distance-label-content {
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
          color: white;
          padding: 4px 8px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 600;
          white-space: nowrap;
          text-align: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        .distance-value {
          font-size: 11px;
          font-weight: bold;
        }
        
        .distance-name {
          font-size: 9px;
          opacity: 0.8;
          margin-top: 2px;
        }
        
        /* Style untuk route tooltip */
        .route-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          color: white !important;
          font-size: 11px !important;
          padding: 4px 8px !important;
          border-radius: 16px !important;
          border: none !important;
          font-weight: 500 !important;
        }
        
        .route-tooltip::before {
          border-top-color: rgba(0, 0, 0, 0.8) !important;
        }
        
        /* Animasi untuk marker */
        .marker-pin {
          transition: transform 0.2s ease;
        }
        
        .marker-pin:hover {
          transform: rotate(-45deg) scale(1.1);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}