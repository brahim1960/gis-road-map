
<!-- Modal Delete -->
<div class="modal fade" id="delete{{ $kerusakan->id }}" tabindex="-1" aria-labelledby="deleteLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <form action="{{ route('kerusakan-jalan.destroy', $kerusakan->id) }}" method="POST">
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
                        <label for="alamat">Alamat</label>
                        <input class="form-control" disabled id="alamat" value="{{ $kerusakan->alamat }}">
                    </div>

                    @php
                        $staValue = '';
                        if($kerusakan->km_awal && $kerusakan->m_awal && $kerusakan->km_akhir && $kerusakan->m_akhir) {
                            $staValue = $kerusakan->km_awal . ' + ' . $kerusakan->m_awal . "\n" .
                                        $kerusakan->km_akhir . ' + ' . $kerusakan->m_akhir;
                        } else {
                            $staValue = '-';
                        }
                    @endphp
                    <div class="row">
                        <div class="col-3">
                            <div class="form-group p-0 mb-3">
                                <label for="sta">STA</label>
                                <textarea class="form-control" disabled id="sta" rows="2" style="resize: none;">{{ $staValue }}</textarea>
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="form-group p-0 mb-3">
                                <label for="panjang">Panjang</label>
                                <input type="text" class="form-control" disabled id="panjang" value="{{ $kerusakan->panjang ? $kerusakan->panjang . ' Meter' : '-' }}">
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="form-group p-0 mb-3">
                                <label for="lebar">Lebar</label>
                                <input type="text" class="form-control" disabled id="lebar" value="{{ $kerusakan->lebar ? $kerusakan->lebar . ' Meter' : '-' }}">
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="form-group p-0 mb-3">
                                <label for="tinggi">Tinggi</label>
                                <input type="text" class="form-control" disabled id="tinggi" value="{{ $kerusakan->tinggi ? $kerusakan->tinggi . ' Meter' : '-' }}">
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <label for="tingkat_kerusakan">Tingkat Kerusakan</label>
                            <input class="form-control" disabled id="tingkat_kerusakan" value="{{ $kerusakan->tingkat_kerusakan }}">
                        </div>
                        <div class="col-6">
                            <label for="jenis_kerusakan">Jenis Kerusakan</label>
                            <input class="form-control" disabled id="jenis_kerusakan" value="{{ $kerusakan->jenis_kerusakan->nama_kerusakan }}">
                        </div>
                    </div>

                    <div class="form-group p-0 mb-3">
                        <label for="kecamatan">Kecamatan</label>
                        <input class="form-control" disabled id="kecamatan" value="{{ $kerusakan->kecamatan->nama_kecamatan }}">
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
