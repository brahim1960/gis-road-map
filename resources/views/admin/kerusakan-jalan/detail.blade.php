<x-layout>
    <x-slot name="title">{{ $title }}</x-slot>

    <div class="page-header mb-0">
        <h3 class="fw-bold mb-3">Kerusakan Jalan</h3>
        <ul class="breadcrumbs mb-3">
            <li class="nav-item">
                <a href="/dashboard">
                    <i class="fas fa-tachometer-alt"></i>
                </a>
            </li>
            <li class="separator">
                <i class="icon-arrow-right"></i>
            </li>
            <li class="nav-item">
                <a href="/dashboard/kerusakan-jalan">Kerusakan Jalan</a>
            </li>
            <li class="separator">
                <i class="icon-arrow-right"></i>
            </li>
            <li class="nav-item">
                <b>Kerusakan {{ $kerusakan->alamat }}</b>
            </li>
        </ul>
    </div>
    <div class="page-category">Detail Data Kerusakan Jalan</div>

    <div class="row">
        <!-- Peta -->
        <div class="card shadow-sm">
            <div class="card-header">
                <h5 class="fw-bold mb-0">Lokasi Kerusakan</h5>
            </div>
            <div class="card-body">
                <div id="detailMap" style="height: 450px;"></div>
            </div>
        </div>

        <div class="card rounded-3 overflow-hidden border-0 shadow-sm">
            <!-- Header Card -->
            <div class="card-header bg-first bg-gradient p-4 border-0">
                <div class="d-flex align-items-center">
                    <div class="rounded-circle bg-white p-3 me-3 d-flex align-items-center justify-content-center">
                        <i class="fas fa-road fs-5 text-first"></i>
                    </div>
                    <div class="d-flex align-items-center justify-content-center">
                        <h4 class="text-white mb-1">Data Kerusakan Jalan</h4>
                    </div>
                </div>
            </div>

            <div class="card-body p-4">
                <!-- Gambar dan Info Grid -->
                <div class="row g-4 mb-4">
                    <!-- Kolom Kiri - Informasi -->
                    <div class="col-lg-8">
                        <div class="row g-4">
                            <!-- Alamat -->
                            <div class="col-6 col-md-4">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                            <i class="fas fa-map-marker-alt text-white"></i>
                                        </span>
                                        <span class="text-muted small">Alamat</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        {{ $kerusakan->alamat }}
                                    </div>
                                </div>
                            </div>

                            <!-- Tingkat Kerusakan -->
                            <div class="col-6 col-md-4">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                            <i class="fas fa-exclamation-triangle text-white"></i>
                                        </span>
                                        <span class="text-muted small">Tingkat Kerusakan</span>
                                    </div>
                                    <div class="d-inline-flex align-items-center icon-mid px-3 py-1 rounded-2
                                        @if($kerusakan->tingkat_kerusakan == 'berat')
                                            bg-danger text-white
                                        @elseif($kerusakan->tingkat_kerusakan == 'sedang')
                                            bg-warning text-dark
                                        @else
                                            bg-info text-white
                                        @endif">
                                        <span>{{ ucfirst($kerusakan->tingkat_kerusakan) }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Jenis Kerusakan -->
                            <div class="col-6 col-md-4">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                            <i class="fas fa-cog text-white"></i>
                                        </span>
                                        <span class="text-muted small">Jenis Kerusakan</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        {{ ucwords($kerusakan->jenis_kerusakan->nama_kerusakan) }}
                                    </div>
                                </div>
                            </div>

                            <div class="col-6 col-md-3">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                            <i class="fas fa-road text-white"></i>
                                        </span>
                                        <span class="text-muted small">STA</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        @if(isset($kerusakan->km_awal, $kerusakan->m_awal, $kerusakan->km_akhir, $kerusakan->m_akhir))
                                            <div style="width: 70px">
                                                <span>{{ $kerusakan->km_awal }} + {{ $kerusakan->m_awal }}</span>
                                                <br>
                                                <span>{{ $kerusakan->km_akhir }} + {{ $kerusakan->m_akhir }}</span>
                                            </div>
                                        @else
                                            -
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <div class="col-6 col-md-3">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                    <i class="fas fa-arrows-alt-v text-white"></i>
                                </span>
                                        <span class="text-muted small">Panjang</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        @if($kerusakan->panjang)
                                            {{ $kerusakan->panjang }} Meter
                                        @else
                                            -
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <div class="col-6 col-md-3">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                    <i class="fas fa-arrows-alt-h text-white"></i>
                                </span>
                                        <span class="text-muted small">Lebar</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        @if($kerusakan->lebar)
                                            {{ $kerusakan->lebar }} Meter
                                        @else
                                            -
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <div class="col-6 col-md-3">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                    <i class="fas fa-level-up-alt text-white"></i>
                                </span>
                                        <span class="text-muted small">Tinggi</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        @if($kerusakan->tinggi)
                                            {{ $kerusakan->tinggi }} Meter
                                        @else
                                            -
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <!-- Deskripsi -->
                            <div class="col-12">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                            <i class="fas fa-align-left text-white"></i>
                                        </span>
                                        <span class="text-muted small">Deskripsi</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        @if($kerusakan->deskripsi)
                                            {{ $kerusakan->deskripsi }}
                                        @else
                                            -
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Kolom Kanan - Gambar -->
                    <div class="col-lg-4">
                        <div class="row mb-4 g-2">
                            <!-- Kecamatan -->
                            <div class="col-6">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                            <i class="fas fa-building text-white"></i>
                                        </span>
                                        <span class="text-muted small">Kecamatan</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        {{ ucwords($kerusakan->kecamatan->nama_kecamatan) }}
                                    </div>
                                </div>
                            </div>

                            <!-- Tanggal -->
                            <div class="col-6">
                                <div class="p-4 rounded-3 bg-light h-100">
                                    <div class="d-flex align-items-center mb-3">
                                        <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                            <i class="fas fa-calendar-alt text-white"></i>
                                        </span>
                                        <span class="text-muted small">Tanggal</span>
                                    </div>
                                    <div class="bg-white px-3 py-2 rounded-3 shadow-sm small">
                                        @if($kerusakan->tanggal)
                                            {{ $kerusakan->tanggal->translatedFormat('j F Y') }}
                                        @else
                                            -
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card h-50 border-0 shadow-sm">
                            <div class="card-header bg-light py-3">
                                <h6 class="mb-0 fw-bold">Gambar Kerusakan</h6>
                            </div>
                            <div class="card-body p-0">
                                @if($kerusakan->gambar && Storage::disk('public')->exists($kerusakan->gambar))
                                    <img src="{{ asset('storage/' . $kerusakan->gambar) }}"
                                         class="img-fluid w-100 object-fit-cover"
                                         alt="Gambar Kerusakan"
                                         loading="lazy">
                                @else
                                    <div class="d-flex align-items-center justify-content-center bg-light h-300">
                                        <p class="text-muted mb-0">Tidak ada gambar</p>
                                    </div>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @push('scripts')
        <script>
            // Fungsi untuk mendapatkan class berdasarkan tingkat kerusakan
            const getMarkerClass = (tingkatKerusakan) => {
                switch(tingkatKerusakan.toLowerCase()) {
                    case 'berat':
                        return 'text-danger';
                    case 'sedang':
                        return 'text-warning';
                    case 'ringan':
                        return 'text-info';
                    default:
                        return 'text-primary';
                }
            };

            // Koordinat dari data kerusakan
            var lat = {{ $kerusakan->latitude }};
            var lng = {{ $kerusakan->longitude }};
            var tingkatKerusakan = '{{ $kerusakan->tingkat_kerusakan }}';

            const createMarkerElement = () => {
                const element = document.createElement('div');
                element.className = 'marker-pin';

                const icon = document.createElement('i');
                icon.className = `fas fa-map-marker-alt ${getMarkerClass(tingkatKerusakan)}`;

                element.appendChild(icon);
                return element;
            };

            // Inisialisasi peta
            var map = new ol.Map({
                target: 'detailMap',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([lng, lat]),
                    zoom: 15,
                    maxZoom: 18
                }),
                controls: ol.control.defaults.defaults().extend([
                    new ol.control.FullScreen(),
                    new ol.control.OverviewMap({
                        layers: [
                            new ol.layer.Tile({
                                source: new ol.source.OSM()
                            })
                        ],
                        collapsed: false,
                        collapsible: true,
                        view: new ol.View({
                            center: ol.proj.fromLonLat([101.4478, 0.5070]),
                            zoom: 6
                        })
                    })
                ])
            });

            // Buat marker overlay
            const marker = new ol.Overlay({
                position: ol.proj.fromLonLat([lng, lat]),
                positioning: 'bottom-center',
                element: createMarkerElement(),
                stopEvent: false,
                offset: [0, 0]
            });

            // Tambahkan marker ke peta
            map.addOverlay(marker);
        </script>
    @endpush

</x-layout>
