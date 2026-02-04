<x-layout>
    <x-slot name="title">{{ $title }}</x-slot>

    <div class="page-header mb-0">
        <h3 class="fw-bold mb-3">Detail Kecamatan</h3>
        <ul class="breadcrumbs mb-3">
            <li class="nav-item">
                <a href="/dashboard">
                    <i class="icon-speedometer"></i>
                </a>
            </li>
            <li class="separator">
                <i class="icon-arrow-right"></i>
            </li>
            <li class="nav-item">
                <a href="/dashboard/kecamatan">Kecamatan</a>
            </li>
            <li class="separator">
                <i class="icon-arrow-right"></i>
            </li>
            <li class="nav-item">
                <b>Kecamatan {{ ucwords($kecamatan->nama_kecamatan) }}</b>
            </li>
        </ul>
    </div>

    <div class="row">
        <div class="col-md-12">
            <!-- Card Utama -->
            <div class="card rounded-3 overflow-hidden border-0 shadow-sm">

                <div class="card-body p-4">
                    <!-- Info Grid -->
                    <div class="row g-4 mb-4">
                        <!-- Card Nama Kecamatan -->
                        <div class="col-sm-6">
                            <div class="p-4 rounded-3 bg-light">
                                <div class="d-flex align-items-center mb-3">
                                    <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                        <i class="fas fa-map-marker-alt text-white"></i>
                                    </span>
                                    <span class="text-muted small">Nama Kecamatan</span>
                                </div>
                                <h5 class="mb-0">{{ ucwords($kecamatan->nama_kecamatan) }}</h5>
                            </div>
                        </div>

                        <!-- Card Status -->
                        <div class="col-sm-6">
                            <div class="p-4 rounded-3 bg-light">
                                <div class="d-flex align-items-center mb-3">
                                                    <span class="rounded-circle bg-fifth bg-opacity-10 p-3 me-3 d-flex align-items-center justify-content-center">
                                                        <i class="fas fa-info-circle text-white"></i>
                                                    </span>
                                    <span class="text-muted small">Status</span>
                                </div>
                                @if($kecamatan->status)
                                    <div class="d-inline-flex align-items-center px-3 py-1 rounded-pill bg-success bg-opacity-10">
                                        <i class="fas fa-check-circle text-white me-2"></i>
                                        <span class="text-white">Aktif</span>
                                    </div>
                                @else
                                    <div class="d-inline-flex align-items-center px-3 py-1 rounded-pill bg-danger bg-opacity-10">
                                        <i class="fas fa-times-circle text-white me-2"></i>
                                        <span class="text-white">Tidak Aktif</span>
                                    </div>
                                @endif
                            </div>
                        </div>

                        <x-map
                            id="map-detail"
                            :defaultPoint="null"
                            :kecamatans="[$kecamatan]"
                            :editable="false"
                            :showSearch="false"
                        />

                    </div>
                </div>
            </div>
        </div>
    </div>

</x-layout>
