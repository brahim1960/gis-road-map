<x-layout>
    <x-slot name="title">{{ $title }}</x-slot>

    <div class="page-header mb-0">
        <h3 class="fw-bold mb-3">Jenis Kerusakan Jalan</h3>
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
                <b>Jenis Kerusakan</b>
            </li>
        </ul>
    </div>
    <div class="page-category">Kelola Data Jenis Kerusakan Jalan</div>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
                        <h4 class="card-title">Data Jenis Kerusakan</h4>
                        <button type="button" class="btn btn-first align-middle d-block rounded-3 mt-3 align-self-start" data-bs-toggle="modal" data-bs-target="#create">
                            <i class="icon-mid fas fa-plus me-1"></i> <span class="align-middle">Tambah Jenis Kerusakan</span>
                        </button>
                        @include('admin.jenis-kerusakan.create')
                    </div>
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
                                <th>Jenis Kerusakan</th>
                                <th>Deskripsi</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            @foreach($jenisKerusakans as $jenisKerusakan)
                                <tr>
                                    <td class="text-center">{{ $loop->iteration }}</td>
                                    <td>{{ ucwords($jenisKerusakan->nama_kerusakan) }}</td>
                                    @if(isset($jenisKerusakan->deskripsi))
                                        <td class="text-justify" style="max-width: 500px">{{ ucfirst($jenisKerusakan->deskripsi) }}</td>
                                    @else
                                        <td>-</td>
                                    @endif
                                    <td>
                                        <div class="d-flex flex-column flex-md-row justify-content-center gap-2">
                                            <div class="d-inline-block"
                                                 data-bs-toggle="tooltip" data-bs-placement="top"
                                                 data-bs-title="Edit">
                                                <button type="button" class="btn btn-icon btn-round btn-primary"
                                                        data-bs-toggle="modal" data-bs-target="#update{{ $jenisKerusakan->id }}">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                @include('admin.jenis-kerusakan.update')
                                            </div>

                                            <div class="d-inline-block"
                                                 data-bs-toggle="tooltip" data-bs-placement="top"
                                                 data-bs-title="Hapus">
                                                <button type="button" class="btn btn-icon btn-round btn-danger"
                                                        data-bs-toggle="modal" data-bs-target="#delete{{ $jenisKerusakan->id }}">
                                                    <i class="icon-mid fas fa-trash-alt"></i>
                                                </button>
                                                @include('admin.jenis-kerusakan.delete')
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
