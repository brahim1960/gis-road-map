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
                <a href="{{ route('kerusakan-jalan.index') }}">Kerusakan Jalan</a>
            </li>
            <li class="separator">
                <i class="icon-arrow-right"></i>
            </li>
            <li class="nav-item">
                <b>Tambah Kerusakan Jalan</b>
            </li>
        </ul>
    </div>
    <div class="page-category">Tambah Data Kerusakan Jalan</div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title">Form Tambah Data Kerusakan Jalan</h4>
                </div>

                <form action="{{ route('kerusakan-jalan.store') }}" method="POST" enctype="multipart/form-data">
                    <div class="card-body">
                        <div class="alert alert-info d-flex align-items-center alert-dismissible show fade" role="alert">
                            <i class="fas fa-exclamation-circle me-3"></i>
                            <div class="align-middle">
                                Pilih lokasi hanya di area Kabupaten <b>Indragiri Hulu</b>. Saat mengklik peta, akan muncul nama kecamatan, jalan, dan koordinat (latitude & longitude)
                            </div>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                        @csrf
                        <div class="row">
                            <div class="form-group">
                                <label for="create-map">
                                    Pilih Lokasi Kerusakan
                                    <small class="text-danger">*</small>
                                </label>
                                <x-map
                                    id="create-map"
                                    height="400px"
                                    :defaultPoint="old('point')"
                                    :kecamatans="$kecamatans"
                                    :editable="true"
                                    :showSearch="true"
                                    :outlineOnly="true"
                                    :zoom="13"
                                    :defaultCenter="[102.288, -0.372]"
                                />
                                <input type="hidden" name="point" id="point" value="{{ old('point') }}">
                                @if ($errors->has('point'))
                                    <div class="invalid-feedback d-block">
                                        {{ $errors->first('point') }}
                                    </div>
                                @endif
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="alamat">
                                        Alamat
                                        <small class="text-danger">*</small>
                                    </label>
                                    <input type="text" class="form-control @error('alamat') is-invalid @enderror"
                                           id="alamat" name="alamat" placeholder="Alamat Kerusakan Jalan" value="{{ old('alamat') }}" required>
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
                                                   id="km_awal" name="km_awal" placeholder="STA KM Awal Kerusakan Jalan" value="{{ old('km_awal') }}">
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
                                                   id="m_awal" name="m_awal" placeholder="STA M Awal Kerusakan Jalan" value="{{ old('m_awal') }}">
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
                                                   id="km_akhir" name="km_akhir" placeholder="STA KM Akhir Kerusakan Jalan" value="{{ old('km_akhir') }}">
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
                                                   id="m_akhir" name="m_akhir" placeholder="STA M Akhir Kerusakan Jalan" value="{{ old('m_akhir') }}">
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
                                                   id="panjang" name="panjang" placeholder="Panjang Kerusakan" value="{{ old('panjang') }}">
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
                                                   id="lebar" name="lebar" placeholder="Lebar Kerusakan" value="{{ old('lebar') }}">
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
                                                   id="tinggi" name="tinggi" placeholder="Tinggi Kerusakan" value="{{ old('tinggi') }}">
                                            @error('tinggi')
                                            <div class="invalid-feedback">{{ $message }}</div>
                                            @enderror
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="deskripsi">Deskripsi</label>
                                    <textarea class="form-control @error('deskripsi') is-invalid @enderror"
                                              id="deskripsi" placeholder="Deskripsi Kerusakan Jalan" name="deskripsi" rows="4">{{ old('deskripsi') }}</textarea>
                                    @error('deskripsi')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="form-group">
                                    <label for="nama_kecamatan">
                                        Kecamatan
                                        <small class="text-danger">*</small>
                                    </label>
                                    <input type="text" class="form-control"
                                           id="nama_kecamatan" disabled placeholder="Kecamatan" value="{{ old('kecamatan') }}">

                                    <input type="hidden" name="kecamatan_id" id="kecamatan" value="{{ old('kecamatan_id') }}">
                                    @if ($errors->has('kecamatan_id'))
                                        <div class="invalid-feedback d-block">
                                            {{ $errors->first('kecamatan_id') }}
                                        </div>
                                    @endif
                                </div>

                                <div class="form-group">
                                    <label for="tingkat_kerusakan">
                                        Tingkat Kerusakan
                                        <small class="text-danger">*</small>
                                    </label>
                                    <select class="form-control form-select @error('tingkat_kerusakan') is-invalid @enderror"
                                            id="tingkat_kerusakan" name="tingkat_kerusakan" required>
                                        <option value="">Pilih Tingkat Kerusakan</option>
                                        <option value="ringan" {{ old('tingkat_kerusakan') == 'ringan' ? 'selected' : '' }}>Ringan</option>
                                        <option value="sedang" {{ old('tingkat_kerusakan') == 'sedang' ? 'selected' : '' }}>Sedang</option>
                                        <option value="berat" {{ old('tingkat_kerusakan') == 'berat' ? 'selected' : '' }}>Berat</option>
                                    </select>
                                    @error('tingkat_kerusakan')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="form-group">
                                    <label for="jenis_kerusakan_id">
                                        Jenis Kerusakan
                                        <small class="text-danger">*</small>
                                    </label>
                                    <select class="form-control form-select @error('jenis_kerusakan_id') is-invalid @enderror"
                                            id="jenis_kerusakan_id" name="jenis_kerusakan_id" required>
                                        <option value="">Pilih Jenis Kerusakan</option>
                                        @foreach($jenisKerusakan as $jenis)
                                            <option value="{{ $jenis->id }}" {{ old('jenis_kerusakan_id') == $jenis->id ? 'selected' : '' }}>
                                                {{ ucwords($jenis->nama_kerusakan) }}
                                            </option>
                                        @endforeach
                                    </select>
                                    @error('jenis_kerusakan_id')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="form-group">
                                    <label for="tanggal">Tanggal</label>
                                    <input type="date" class="form-control @error('tanggal') is-invalid @enderror"
                                           id="tanggal" name="tanggal" value="{{ old('tanggal') }}">
                                    @error('tanggal')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="form-group">
                                    <label for="gambar">Gambar</label>
                                    <input type="file" class="form-control @error('gambar') is-invalid @enderror"
                                           id="gambar" name="gambar" placeholder="Masukkan Gambar" accept="image/*">
                                    <div id="image-preview" class="img-fluid col-8"></div>
                                    @error('gambar')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-action text-end">
                        <button type="submit" class="btn btn-first">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

</x-layout>
