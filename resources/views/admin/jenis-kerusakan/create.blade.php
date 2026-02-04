<!-- Modal Create -->
<div class="modal fade" id="create" tabindex="-1" aria-labelledby="createLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <form action="{{ route('jenis-kerusakan.store') }}" method="POST">
                @csrf
                <div class="modal-header">
                    <h5 class="modal-title" id="createLabel">Tambah Jenis Kerusakan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="nama_kerusakan" class="form-label">
                            Nama Kerusakan
                            <small class="text-danger">*</small>
                        </label>
                        <input type="text" class="form-control @error('nama_kerusakan') is-invalid @enderror"
                               id="nama_kerusakan" name="nama_kerusakan" value="{{ old('nama_kerusakan') }}" required>
                        @error('nama_kerusakan')
                        <div class="invalid-feedback">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>
                    <div class="mb-3">
                        <label for="deskripsi" class="form-label">Deskripsi</label>
                        <textarea class="form-control @error('deskripsi') is-invalid @enderror"
                                  id="deskripsi" name="deskripsi" rows="4">{{ old('deskripsi') }}</textarea>
                        @error('deskripsi')
                        <div class="invalid-feedback">
                            {{ $message }}
                        </div>
                        @enderror
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link text-black-50" data-bs-dismiss="modal">Tutup</button>
                    <button type="submit" class="btn btn-first">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</div>
