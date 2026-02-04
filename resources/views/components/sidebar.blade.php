<div class="sidebar" data-background-color="white">
    <div class="sidebar-logo">
        <!-- Logo Header -->
        <div class="logo-header btn-first" data-background-color="white">
            <a href="/" class="logo">
                <img src="{{ asset('assets/img/road.png') }}" alt="navbar brand" class="navbar-brand me-2" height="20"/>
                <span class="text-first fw-bold">Jalan
                    <span class="text-muted fw-bold"> Indragiri Hulu</span>
                </span>

            </a>
            <div class="nav-toggle">
                <button class="btn btn-toggle toggle-sidebar">
                    <i class="gg-menu-right"></i>
                </button>
                <button class="btn btn-toggle sidenav-toggler">
                    <i class="gg-menu-left"></i>
                </button>
            </div>
            <button class="topbar-toggler more">
                <i class="gg-more-vertical-alt"></i>
            </button>
        </div>
        <!-- End Logo Header -->
    </div>
    <div class="sidebar-wrapper scrollbar scrollbar-inner">
        <div class="sidebar-content">
            <ul class="nav nav-secondary">
                @auth
                    @if(Auth::user()->role == 'admin')
                        <li class="nav-section">
                            <span class="sidebar-mini-icon">
                              <i class="fa fa-ellipsis-h"></i>
                            </span>
                            <h4 class="text-section">Admin</h4>
                        </li>
                        <li class="nav-item {{ Request::is('dashboard') ? 'active' : '' }}">
                            <a href="/dashboard">
                                <i class="fas fa-tachometer-alt"></i>
                                <p>Dashboard</p>
                            </a>
                        </li>
                        <li class="nav-item {{ Request::is('dashboard/*') ? 'active submenu' : '' }}">
                            <a data-bs-toggle="collapse" href="#kelola">
                                <i class="fas fa-cog"></i>
                                <p>Kelola</p>
                                <span class="caret"></span>
                            </a>
                            <div class="collapse {{ Request::is('dashboard/*') ? 'show' : '' }}" id="kelola">
                                <ul class="nav nav-collapse">
                                    <li class="{{ Request::is('*jenis-kerusakan*') ? 'active' : '' }}">
                                        <a href="/dashboard/jenis-kerusakan">
                                            <span class="sub-item">Jenis Kerusakan</span>
                                        </a>
                                    </li>
                                    <li class="{{ Request::is('*kecamatan*') ? 'active' : '' }}">
                                        <a href="/dashboard/kecamatan">
                                            <span class="sub-item">Kecamatan</span>
                                        </a>
                                    </li>
                                    <li class="{{ Request::is('*kerusakan-jalan*') ? 'active' : '' }}">
                                        <a href="/dashboard/kerusakan-jalan">
                                            <span class="sub-item">Kerusakan Jalan</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    @endif
                @endauth
                <li class="nav-section">
                <span class="sidebar-mini-icon">
                  <i class="fa fa-ellipsis-h"></i>
                </span>
                    <h4 class="text-section">Halaman</h4>
                </li>
                <li class="nav-item {{ Request::is('/') ? 'active' : '' }}">
                    <a href="/">
                        <i class="fas fa-home"></i>
                        <p>Home</p>
                    </a>
                </li>
                <li class="nav-item {{ Request::is('peta*') ? 'active' : '' }}">
                    <a href="/peta">
                        <i class="fas fa-map-marked-alt"></i>
                        <p>Peta</p>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>
