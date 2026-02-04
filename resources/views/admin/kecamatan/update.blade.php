<div class="modal fade" id="update{{ $kecamatan->id }}" tabindex="-1" aria-labelledby="createLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <form action="{{ route('kecamatan.update', $kecamatan->id) }}" method="POST">
                @csrf
                @method('PUT')
                <div class="modal-header">
                    <h5 class="modal-title" id="createLabel">Tambah Jenis Kerusakan</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3 mb-md-0">
                                <label for="nama_kecamatan" class="form-label">
                                    Nama Kecamatan
                                    <small class="text-danger">*</small>
                                </label>
                                <input type="text" class="form-control @error('nama_kecamatan') is-invalid @enderror"
                                       id="nama_kecamatan" name="nama_kecamatan"
                                       value="{{ old('nama_kecamatan', $kecamatan->nama_kecamatan) }}" required>
                                @error('nama_kecamatan')
                                <div class="invalid-feedback">
                                    {{ $message }}
                                </div>
                                @enderror
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="mb-3 mb-md-0">
                                <label for="status" class="form-label mb-0 mb-md-2">Status</label>
                                <div class="form-check form-switch px-0">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        id="status"
                                        name="status"
                                        {{ $kecamatan->status == '1' ? 'checked' : '' }}>
                                    @error('status')
                                    <div class="invalid-feedback d-block">
                                        {{ $message }}
                                    </div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-link text-black-50" data-bs-dismiss="modal">Tutup</button>
                    <button type="submit" class="btn btn-primary">Edit</button>
                </div>
            </form>
        </div>
    </div>
</div>
