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
                <b>Kerusakan Jalan</b>
            </li>
        </ul>
    </div>
    <div class="page-category">Kelola Data Kerusakan Jalan</div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                        <h4 class="card-title mb-3 mb-sm-0">Data Kerusakan Jalan</h4>
                        <div class="d-flex flex-column flex-sm-row gap-2">
                            <a href="{{ route('kerusakan-jalan.create') }}" class="btn btn-first align-middle rounded-3">
                                <i class="icon-mid fas fa-plus me-1"></i>
                                <span class="align-middle">Tambah Kerusakan Jalan</span>
                            </a>
                            <a href="{{ route('kerusakan-jalan.export.csv') }}" class="btn btn-info align-middle rounded-3">
                                <i class="icon-mid fas fa-file-download me-1"></i>
                                <span class="align-middle">Ekspor Data Kerusakan Jalan</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="alert alert-warning d-flex align-items-center alert-dismissible show fade" role="alert">
                        <i class="fas fa-exclamation-circle me-3"></i>
                        <div class="align-middle">
                            Warna icon gambar <span class='text-success'>hijau</span> untuk gambar tersimpan, <span class='text-danger'>merah</span> untuk belum ada file gambar                    </div>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    <div class="table-responsive">
                        <table
                            id="basic-datatables"
                            class="display table table-striped table-hover"
                        >
                            <thead class="text-center">
                            <tr>
                                <th>No</th>
                                <th>Alamat</th>
                                <th>STA</th>
                                <th>Panjang</th>
                                <th>Lebar</th>
                                <th>Tinggi</th>
                                <th>Tingkat Kerusakan</th>
                                <th>Jenis Kerusakan</th>
                                <th>Kecamatan</th>
                                <th>Gambar</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($kerusakans as $kerusakan)
                                <tr>
                                    <td class="text-center">{{ $loop->iteration }}</td>
                                    <td class="text-center">{{ $kerusakan->alamat }}</td>
                                    <td class="text-center">
                                        @if(isset($kerusakan->km_awal, $kerusakan->m_awal, $kerusakan->km_akhir, $kerusakan->m_akhir))
                                            <div style="width: 70px">
                                                <span>{{ $kerusakan->km_awal }} + {{ $kerusakan->m_awal }}</span>
                                                <br>
                                                <span>{{ $kerusakan->km_akhir }} + {{ $kerusakan->m_akhir }}</span>
                                            </div>
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td class="text-center">
                                        @if($kerusakan->panjang)
                                            {{ $kerusakan->panjang }} M
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td class="text-center">
                                        @if($kerusakan->lebar)
                                            {{ $kerusakan->lebar }} M
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td class="text-center">
                                        @if($kerusakan->tinggi)
                                            {{ $kerusakan->tinggi }} M
                                        @else
                                            -
                                        @endif
                                    </td>
                                    <td class="text-center">{{ ucwords($kerusakan->tingkat_kerusakan) }}</td>
                                    <td class="text-center">{{ ucwords($kerusakan->jenis_kerusakan->nama_kerusakan) }}</td>
                                    <td class="text-center">{{ ucwords($kerusakan->kecamatan->nama_kecamatan) }}</td>
                                    <td class="text-center">
                                        @if(isset($kerusakan->gambar) && Storage::disk('public')->exists($kerusakan->gambar))
                                            <i class="text-success far fa-file-image"></i>
                                        @else
                                            <i class="text-danger far fa-file-image"></i>
                                        @endif
                                    </td>
                                    <td>
                                        <div class="d-flex justify-content-center">
                                            <a href="/dashboard/kerusakan-jalan/{{ $kerusakan->id }}"
                                               class="btn btn-icon btn-link btn-info"
                                               data-bs-toggle="tooltip" data-bs-placement="top"
                                               data-bs-title="Info">
                                               <i class="fas fa-info-circle"></i>
                                            </a>
                                            <a href="{{ route('kerusakan-jalan.edit', $kerusakan->id) }}"
                                               class="btn btn-icon btn-link btn-primary"
                                               data-bs-toggle="tooltip" data-bs-placement="top"
                                               data-bs-title="Edit">
                                               <i class="fas fa-edit"></i>
                                            </a>
                                            <div class="d-inline-block"
                                                 data-bs-toggle="tooltip" data-bs-placement="top"
                                                 data-bs-title="Hapus">
                                                <button type="button" class="btn btn-icon btn-link btn-danger"
                                                        data-bs-toggle="modal" data-bs-target="#delete{{ $kerusakan->id }}">
                                                   <i class="icon-mid fas fa-trash-alt"></i>
                                                </button>
                                                @include('admin.kerusakan-jalan.delete')
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
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
