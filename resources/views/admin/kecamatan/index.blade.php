<x-layout>
    <x-slot name="title">{{ $title }}</x-slot>

    <div class="page-header mb-0">
        <h3 class="fw-bold mb-3">Kecamatan</h3>
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
                <b>Kecamatan</b>
            </li>
        </ul>
    </div>
    <div class="page-category">Kelola Data Kecamatan</div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">Data Kecamatan</h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table
                            id="basic-datatables"
                            class="display table table-striped table-hover"
                        >
                            <thead class="text-center">
                            <tr>
                                <th>No</th>
                                <th>Nama Kecamatan</th>
                                <th>status</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody class="text-center">
                            @foreach($kecamatans as $kecamatan)
                                <tr>
                                    <td>{{ $loop->iteration }}</td>
                                    <td>{{ ucwords($kecamatan->nama_kecamatan) }}</td>
                                    <td>
                                        @if($kecamatan->status == 1)
                                            <div class="badge bg-success bg-opacity-10">
                                                <i class="fas fa-check-circle text-white me-2"></i>
                                                <span>Active</span>
                                            </div>
                                        @else
                                            <div class="badge bg-danger bg-opacity-10">
                                                <i class="fas fa-times-circle text-white me-2"></i>
                                                <span>Non Active</span>
                                            </div>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="d-flex flex-column flex-md-row justify-content-center gap-2">
                                            <a href="/dashboard/kecamatan/{{ $kecamatan->id }}"
                                               class="btn btn-icon btn-round btn-info"
                                               data-bs-toggle="tooltip" data-bs-placement="top"
                                               data-bs-title="Info">
                                                <i class="fas fa-info-circle"></i>
                                            </a>
                                            <div class="d-inline-block"
                                                data-bs-toggle="tooltip" data-bs-placement="top"
                                                data-bs-title="Edit">
                                                <button type="button" class="btn btn-icon btn-round btn-primary"
                                                        data-bs-toggle="modal" data-bs-target="#update{{ $kecamatan->id }}">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                            </div>
                                            @include('admin.kecamatan.update')
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header">
                    <h3 class="card-title">Peta Kecamatan</h3>
                </div>
                <div class="card-body">
                    <x-map
                        id="map-kecamatan"
                        :defaultPoint="null"
                        :kecamatans="$kecamatans"
                        :editable="false"
                        :showSearch="false"
                        height="500px"
                    />
                    </div>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
        <script>
            $("#basic-datatables").DataTable({});
        </script>
    @endpush

</x-layout>
