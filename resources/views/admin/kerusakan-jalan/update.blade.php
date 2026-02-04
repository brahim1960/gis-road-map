<x-layout>
    <x-slot name="title">{{ $title }}</x-slot>

    <div class="page-header mb-0">
        <h3 class="fw-bold mb-3">Kerusakan Jalan</h3>
        <ul class="breadcrumbs mb-3">
            <li class="nav-item">
                <a href="/dashboard"><i class="fas fa-tachometer-alt"></i></a>
            </li>
            <li class="separator"><i class="icon-arrow-right"></i></li>
            <li class="nav-item"><a href="{{ route('kerusakan-jalan.index') }}">Kerusakan Jalan</a></li>
            <li class="separator"><i class="icon-arrow-right"></i></li>
            <li class="nav-item"><b>Edit Kerusakan Jalan</b></li>
        </ul>
    </div>

    <div class="page-category">Edit Data Kerusakan Jalan</div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">Form Edit Kerusakan Jalan</h4>
                </div>

                <form action="{{ route('kerusakan-jalan.update', $kerusakan->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT')

                    <div class="card-body">
                        <div class="alert alert-info d-flex align-items-center alert-dismissible show fade" role="alert">
                            <i class="fas fa-exclamation-circle me-3"></i>
                            <div class="align-middle">
                                Klik lokasi pada peta untuk memperbarui koordinat. Pastikan tetap berada dalam wilayah <b>Indragiri Hulu</b>
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>

                        <div class="row">
                            <div class="form-group">
                                <label for="edit-map">
                                    Pilih Lokasi Kerusakan
                                    <small class="text-danger">*</small>
                                </label>
                                <x-map
                                    id="edit-map"
                                    height="500px"
                                    :defaultPoint="old('point', 'POINT(' . $kerusakan->longitude . ' ' . $kerusakan->latitude . ')')"
                                    :kecamatans="$kecamatans"
                                    :editable="true"
                                    :showSearch="true"
                                    :outlineOnly="true"
                                    :zoom="13"
                                    :defaultCenter="[102.288, -0.372]"
                                />
                                <input type="hidden" name="point" id="point" value="{{ old('point', 'POINT(' . $kerusakan->longitude . ' ' . $kerusakan->latitude . ')') }}">
                                @error('point')
                                    <div class="invalid-feedback d-block">{{ $message }}</div>
                                @enderror
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="alamat">
                                        Alamat
                                        <small class="text-danger">*</small>
                                    </label>
                                    <input type="text" id="alamat" name="alamat" class="form-control @error('alamat') is-invalid @enderror"
                                           value="{{ old('alamat', $kerusakan->alamat) }}" required>
                                    @error('alamat')
                                        <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="km_awal">
                                                KM Awal
                                            </label>
                                            <input type="number" class="form-control @error('km_awal') is-invalid @enderror"
                                                   id="km_awal" name="km_awal" placeholder="STA KM Awal Kerusakan Jalan" value="{{ old('km_awal', $kerusakan->km_awal) }}">
                                            @error('km_awal')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="m_awal">
                                                M Awal
                                            </label>
                                            <input type="number" class="form-control @error('m_awal') is-invalid @enderror"
                                                   id="m_awal" name="m_awal" placeholder="STA M Awal Kerusakan Jalan" value="{{ old('m_awal', $kerusakan->m_awal) }}">
                                            @error('m_awal')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="km_akhir">
                                                KM Akhir
                                            </label>
                                            <input type="number" class="form-control @error('km_akhir') is-invalid @enderror"
                                                   id="km_akhir" name="km_akhir" placeholder="STA KM Akhir Kerusakan Jalan" value="{{ old('km_akhir', $kerusakan->km_akhir) }}">
                                            @error('km_akhir')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <div class="form-group">
                                            <label for="m_akhir">
                                                M Akhir
                                            </label>
                                            <input type="number" class="form-control @error('m_akhir') is-invalid @enderror"
                                                   id="m_akhir" name="m_akhir" placeholder="STA M Akhir Kerusakan Jalan" value="{{ old('m_akhir', $kerusakan->m_akhir) }}">
                                            @error('m_akhir')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-4">
                                        <div class="form-group">
                                            <label for="panjang">
                                                Panjang
                                            </label>
                                            <input type="number" step=".1" class="form-control @error('panjang') is-invalid @enderror"
                                                   id="panjang" name="panjang" placeholder="Panjang Kerusakan" value="{{ old('panjang', $kerusakan->panjang) }}">
                                            @error('panjang')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="form-group">
                                            <label for="lebar">
                                                Lebar
                                            </label>
                                            <input type="number" step=".1" class="form-control @error('lebar') is-invalid @enderror"
                                                   id="lebar" name="lebar" placeholder="Lebar Kerusakan" value="{{ old('lebar', $kerusakan->lebar) }}">
                                            @error('lebar')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                    <div class="col-4">
                                        <div class="form-group">
                                            <label for="tinggi">
                                                Tinggi
                                            </label>
                                            <input type="number" step=".1" class="form-control @error('tinggi') is-invalid @enderror"
                                                   id="tinggi" name="tinggi" placeholder="Tinggi Kerusakan" value="{{ old('tinggi', $kerusakan->tinggi) }}">
                                            @error('tinggi')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group ">
                                    <label for="deskripsi">Deskripsi</label>
                                    <textarea name="deskripsi" id="deskripsi" class="form-control">{{ old('deskripsi', $kerusakan->deskripsi) }}</textarea>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="nama_kecamatan">Kecamatan <small class="text-danger">*</small></label>
                                    <input type="text" class="form-control" id="nama_kecamatan"
                                           value="{{ old('nama_kecamatan', optional($kerusakan->kecamatan)->nama_kecamatan) }}" disabled>
                                    <input type="hidden" name="kecamatan_id" id="kecamatan" value="{{ old('kecamatan_id', $kerusakan->kecamatan_id) }}">
                                    @error('kecamatan_id')<div class="invalid-feedback d-block">{{ $message }}</div>@enderror
                                </div>

                                <div class="form-group">
                                    <label for="tingkat_kerusakan">Tingkat Kerusakan <small class="text-danger">*</small></label>
                                    <select name="tingkat_kerusakan" id="tingkat_kerusakan" class="form-control" required>
                                        <option value="">Pilih</option>
                                        @foreach(['ringan', 'sedang', 'berat'] as $tk)
                                            <option value="{{ $tk }}" {{ old('tingkat_kerusakan', $kerusakan->tingkat_kerusakan) == $tk ? 'selected' : '' }}>
                                                {{ ucfirst($tk) }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="jenis_kerusakan_id">Jenis Kerusakan</label>
                                    <select name="jenis_kerusakan_id" id="jenis_kerusakan_id" class="form-control" required>
                                        <option value="">Pilih</option>
                                        @foreach($jenisKerusakan as $jenis)
                                            <option value="{{ $jenis->id }}" {{ old('jenis_kerusakan_id', $kerusakan->jenis_kerusakan_id) == $jenis->id ? 'selected' : '' }}>
                                                {{ ucwords($jenis->nama_kerusakan) }}
                                            </option>
                                        @endforeach
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="tanggal">Tanggal</label>
                                    <input type="date" name="tanggal" id="tanggal" class="form-control" value="{{ old('tanggal', optional($kerusakan->tanggal)->format('Y-m-d')) }}">
                                </div>

                                <div class="form-group">
                                    <label for="gambar">Gambar</label>
                                    <input type="file" name="gambar" id="gambar" class="form-control" accept="image/*">
                                    <div id="image-preview" class="img-fluid col-8 mt-2">
                                        @if ($kerusakan->gambar)
                                            <img src="{{ asset('storage/' . $kerusakan->gambar) }}" class="img-fluid" style="max-width: 100%; height: auto;">
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-action text-end">
                        <button type="submit" class="btn btn-primary">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    @push('scripts')
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                initImagePreview('gambar', 'image-preview');
            });
        </script>
    @endpush

</x-layout>
