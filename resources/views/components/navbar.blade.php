<nav class="navbar navbar-header navbar-header-transparent navbar-expand-lg border-bottom">
    <div class="container-fluid">
        <nav class="navbar navbar-header-left navbar-expand-lg navbar-form nav-search p-0 d-none d-lg-flex"></nav>

        <ul class="navbar-nav topbar-nav ms-md-auto align-items-center">
            @auth
            <li class="nav-item topbar-user dropdown hidden-caret">
                <a
                    class="dropdown-toggle profile-pic"
                    data-bs-toggle="dropdown"
                    href="#"
                    aria-expanded="false"
                >
                    <div class="avatar-sm">
                        <img
                            src="{{ asset('assets/img/male_avatar.svg') }}"
                            alt="..."
                            class="avatar-img rounded-circle"
                        />
                    </div>
                    <span class="profile-username">
                      <span class="me-7"></span>
                      <span class="op-7">Hi,</span>
                      <span class="fw-bold">{{ Auth::user()->username }}</span>
                    </span>
                </a>
                <ul class="dropdown-menu dropdown-user animated fadeIn">
                    <div class="dropdown-user-scroll scrollbar-outer">
                        <li>
                            <div class="user-box">
                                <div class="avatar-lg">
                                    <img
                                        src="{{ asset('assets/img/male_avatar.svg') }}"
                                        alt="image profile"
                                        class="avatar-img rounded"
                                    />
                                </div>
                                <div class="u-text">
                                    <h4>{{ Auth::user()->name }}</h4>
                                    <p class="text-muted mb-0">{{ Auth::user()->role }}</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="dropdown-divider"></div>
                            <button type="button" id="logout" class="dropdown-item">Logout</button>
                        </li>
                    </div>
                </ul>
            </li>
            @else
                <a href="/login" class="btn btn-first rounded-5 px-3 ms-2">
                    <span class="d-flex align-items-center">
                        <i class="fas fa-sign-in-alt me-2"></i>
                        <span>Login</span>
                    </span>
                </a>
            @endauth
        </ul>
    </div>
</nav>

<x-modalLogout></x-modalLogout>
