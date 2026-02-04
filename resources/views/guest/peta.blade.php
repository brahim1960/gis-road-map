<x-layout>
    <x-slot name="title">{{ $title }}</x-slot>
    <div class="page-header mb-0">
        <h3 class="fw-bold mb-3">Peta</h3>
        <ul class="breadcrumbs mb-3">
            <li class="nav-home">
                <a href="#">
                    <i class="fas fa-home"></i>
                </a>
            </li>
            <li class="separator">
                <i class="icon-arrow-right"></i>
            </li>
            <li class="nav-item">
                <a href="#">Peta</a>
            </li>
        </ul>
    </div>
    <div class="page-category">Peta Kerusakan Jalan dan Heatmap KDE</div>

    <!-- Main Map Section -->
    <div id="peta" class="row">
        <div class="col-12">
            <div class="card">
                <div class="card-body">
                    <ul class="nav nav-tabs nav-line nav-color-primary" id="line-tab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="peta" data-bs-toggle="pill" href="#line-home" role="tab" aria-controls="pills-home" aria-selected="true">Peta Kerusakan</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="heatmap" data-bs-toggle="pill" href="#line-profile" role="tab" aria-controls="pills-profile" aria-selected="false">Heatmap KDE</a>
                        </li>
                    </ul>
                    <div class="tab-content mt-3 mb-3" id="line-tabContent">
                        <div class="tab-pane fade show active" id="line-home" role="tabpanel" aria-labelledby="peta">
                            <h4>Peta Kerusakan Jalan indragiri Hulu</h4>
                            <div class="card-category mb-3">Klik pada titik untuk melihat detail kerusakan</div>
                            <x-map
                                id="view-map"
                                height="500px"
                                :showSearch="true"
                                :zoom="10"
                                :defaultCenter="[102.288, -0.372]"
                                :outlineOnly="true"
                                :kerusakanPoints="$kerusakanPoints"
                            />
                            <div class="legend mt-3">
                                <h6 class="fw-bold">Keterangan:</h6>
                                <div class="d-flex gap-4">
                                    <div class="d-flex align-items-center">
                                            <span class="badge bg-danger me-2">
                                                <i class="fas fa-map-marker-alt"></i>
                                            </span>
                                        <small>Kerusakan Berat</small>
                                    </div>
                                    <div class="d-flex align-items-center">
                                            <span class="badge bg-warning me-2">
                                                <i class="fas fa-map-marker-alt"></i>
                                            </span>
                                        <small>Kerusakan Sedang</small>
                                    </div>
                                    <div class="d-flex align-items-center">
                                            <span class="badge bg-info me-2">
                                                <i class="fas fa-map-marker-alt"></i>
                                            </span>
                                        <small>Kerusakan Ringan</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="line-profile" role="tabpanel" aria-labelledby="heatmap">
                            <h4>Heatmap KDE</h4>
                            <div class="card-category mb-3">Analisis spasial kerusakan jalan menggunakan Network Kernel Density Estimation</div>                            <x-map
                                id="kde-map"
                                height="500px"
                                :showSearch="true"
                                :zoom="10"
                                :defaultCenter="[102.288, -0.372]"
                                :outlineOnly="true"
                                :kerusakanPoints="$kerusakanPoints"
                                :radius="$radius"
                                :jalanSegments="$jalanSegments"
                            />
                            <!-- Tambahkan di view setelah map -->
                            <div class="legend mt-3">
                                <h6 class="fw-bold mb-3">Keterangan Network Kernel Density Estimation</h6>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="d-flex flex-column gap-2">
                                            <div class="d-flex align-items-center">
                                                <div style="width: 30px; height: 4px; background: rgba(255, 0, 0, 1); margin-right: 10px; border-radius: 2px;"></div>
                                                <small><strong>Kepadatan </strong> > 0.00001</small>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <div style="width: 30px; height: 4px; background: rgba(255, 165, 0, 1); margin-right: 10px; border-radius: 2px;"></div>
                                                <small><strong>Kepadatan </strong>0.000005 - 0.00001</small>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <div style="width: 30px; height: 4px; background: rgba(255, 255, 0, 1); margin-right: 10px; border-radius: 2px;"></div>
                                                <small><strong>Kepadatan </strong>0.000001 - 0.000005</small>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <div style="width: 30px; height: 4px; background: rgb(58,189,29); margin-right: 10px; border-radius: 2px;"></div>
                                                <small><strong>Kepadatan </strong>0.000001 - 0.000003</small>
                                            </div>
                                            <div class="d-flex align-items-center">
                                                <div style="width: 30px; height: 4px; background: rgba(52, 152, 219, 0.7); margin-right: 10px; border-radius: 2px;"></div>
                                                <small><strong>Kepadatan </strong>≤ 0.000001</small>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="p-2 bg-light rounded">
                                            <small class="text-muted d-block mb-1">
                                                Radius <strong>{{ $radius }} meter</strong>
                                            </small>
                                            <small class="text-muted d-block">
                                                Klik segmen jalan untuk detail density
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-layout>
