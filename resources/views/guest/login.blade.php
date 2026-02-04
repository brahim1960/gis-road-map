<x-layout>
    <x-slot name="title">{{ $title }}</x-slot>

    <div class="page-header mb-0">
        <h3 class="fw-bold mb-3">Peta Kerusakan Jalan</h3>
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
                <a href="#">Login</a>
            </li>
        </ul>
    </div>

    <div class="d-flex justify-content-center align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6">
                    <div class="text-center mb-4">
                        <h3 class="text-dark fw-bold">Welcome</h3>
                        <p class="text-muted">Login untuk masuk</p>
                    </div>
                    <div class="card border-0 shadow-lg rounded-4">
                        <div class="card-body p-4 p-sm-5">
                            <form method="POST" action="{{ url('login') }}" class="needs-validation" novalidate>
                                @csrf
                                <div class="mb-4">
                                    <label for="username" class="form-label small fw-bold text-first mb-1">USERNAME</label>
                                    <div class="input-group">
                            <span class="input-group-text border-end-0 bg-white">
                                <i class="fas fa-user fa-sm text-first"></i>
                            </span>
                                        <input type="text" class="form-control @error('username') is-invalid @enderror" id="username" name="username" value="{{ old('username') }}" placeholder="Masukkan username" required autofocus>
                                    </div>
                                    @error('username')
                                    <small class="text-danger">
                                        <i class="fas fa-exclamation-circle me-1"></i>
                                        {{ $message }}
                                    </small>
                                    @enderror
                                </div>

                                <div class="mb-4">
                                    <label for="password" class="form-label small fw-bold text-first mb-1">PASSWORD</label>
                                    <div class="input-group">
                            <span class="input-group-text border-end-0 bg-white">
                                <i class="fas fa-lock fa-sm text-first"></i>
                            </span>
                                        <input type="password" class="form-control @error('password') is-invalid @enderror" id="password" name="password" placeholder="Masukkan password" required>
                                    </div>
                                    @error('password')
                                    <small class="text-danger">
                                        <i class="fas fa-exclamation-circle me-1"></i>
                                        {{ $message }}
                                    </small>
                                    @enderror
                                </div>

                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-first py-3 rounded-3 text-uppercase fw-bold">
                                        <i class="fas fa-sign-in-alt me-2"></i>
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</x-layout>
