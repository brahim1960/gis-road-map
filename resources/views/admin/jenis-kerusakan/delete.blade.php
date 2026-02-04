<!-- Modal Delete -->
<div class="modal fade" id="delete{{ $jenisKerusakan->id }}" tabindex="-1" aria-labelledby="deleteLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <form action="{{ route('jenis-kerusakan.destroy', $jenisKerusakan->id) }}" method="POST">
                @csrf
                @method('DELETE')
                <div class="modal-header bg-danger">
                    <h5 class="modal-title fw-bold" id="deleteLabel">
                        Yakin Menghapus Data ini?
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="alert alert-danger shadow-sm d-flex align-items-center" role="alert">
                        <i class="fas fa-exclamation-triangle fs-1 me-3 text-danger"></i>
                        <div class="align-middle">
                            <h6 class="mb-0 fw-bold">Peringatan!</h6>
                            <p class="mb-0">Data yang dihapus tidak dapat dikembalikan.</p>
                        </div>
                    </div>
                    <div class="form-group p-0 mb-3">
                        <label for="nama">Nama Jenis Kerusakan</label>
                        <input class="form-control" disabled id="nama" value="{{ $jenisKerusakan->nama_kerusakan }}">
                    </div>

                    <div class="form-group p-0">
                        <label for="deskripsi">Deskripsi</label>
                        @if($jenisKerusakan->deskripsi)
                            <textarea class="form-control" disabled rows="5" id="deskripsi">{{ $jenisKerusakan->deskripsi }}</textarea>
                        @else
                            <textarea class="form-control" disabled rows="5" id="deskripsi">-</textarea>
                        @endif
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-link text-black-50" data-bs-dismiss="modal">Batal</button>
                    <button type="submit" class="btn btn-danger">Hapus</button>
                </div>
            </form>
        </div>
    </div>
</div>
