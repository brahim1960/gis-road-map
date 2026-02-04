<x-layout>
    <x-slot name="title">{{ $title }}</x-slot>
    <div class="d-flex align-items-left align-items-md-center flex-column flex-md-row pt-2 pb-4">
        <div>
            <h3 class="fw-bold mb-3">SIG Kerusakan Jalan Indragiri Hulu</h3>
            <h6 class="op-7 mb-2">Dashboard Manajemen Data Kerusakan Jalan</h6>
        </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row">
        <div class="col-6 col-md-3">
            <div class="card card-stats card-round">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-icon">
                            <div class="icon-big text-center icon-success bubble-shadow-small">
                                <i class="fas fa-cogs"></i>
                            </div>
                        </div>
                        <div class="col col-stats">
                            <div class="numbers">
                                <p class="card-category">Jenis Kerusakan</p>
                                <h4 class="card-title">{{ $totalJenisKerusakan }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card card-stats card-round">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-icon">
                            <div class="icon-big text-center icon-primary bubble-shadow-small">
                                <i class="fas fa-building"></i>
                            </div>
                        </div>
                        <div class="col col-stats">
                            <div class="numbers">
                                <p class="card-category">Kecamatan</p>
                                <h4 class="card-title">{{ $totalKecamatan }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card card-stats card-round">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-icon">
                            <div class="icon-big text-center icon-black bubble-shadow-small">
                                <i class="fas fa-road"></i>
                            </div>
                        </div>
                        <div class="col col-stats">
                            <div class="numbers">
                                <p class="card-category">Ruas Jalan</p>
                                <h4 class="card-title">{{ $totalRuasJalan }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card card-stats card-round">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-icon">
                            <div class="icon-big text-center icon-secondary bubble-shadow-small">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                        </div>
                        <div class="col col-stats">
                            <div class="numbers">
                                <p class="card-category">Kerusakan Jalan</p>
                                <h4 class="card-title">{{ $totalKerusakan }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card card-stats card-round">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-icon">
                            <div class="icon-big text-center icon-info bubble-shadow-small">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                        </div>
                        <div class="col col-stats">
                            <div class="numbers">
                                <p class="card-category">Kerusakan Ringan</p>
                                <h4 class="card-title">{{ $kerusakanRingan }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card card-stats card-round">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-icon">
                            <div class="icon-big text-center icon-warning bubble-shadow-small">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                        </div>
                        <div class="col col-stats">
                            <div class="numbers">
                                <p class="card-category">Kerusakan Sedang</p>
                                <h4 class="card-title">{{ $kerusakanSedang }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card card-stats card-round">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-icon">
                            <div class="icon-big text-center icon-danger bubble-shadow-small">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                        </div>
                        <div class="col col-stats">
                            <div class="numbers">
                                <p class="card-category">Kerusakan Berat</p>
                                <h4 class="card-title">{{ $kerusakanBerat }}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <div class="card-title">Statistik Kerusakan Jalan</div>
            </div>
            <div class="card-body">
                <div class="chart-container">
                    <canvas id="multipleBarChart"></canvas>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
        <script>
            const statistikData = @json($statistikKecamatan);

            multipleBarChart = document.getElementById("multipleBarChart").getContext("2d");
            let myMultipleBarChart = new Chart(multipleBarChart, {
                type: "bar",
                data: {
                    labels: statistikData.map(item => toTitleCase(item.kecamatan)),
                    datasets: [
                        {
                            label: "Rusak Ringan",
                            backgroundColor: "#177dff",
                            borderColor: "#177dff",
                            data: statistikData.map(item => item.ringan),
                        },
                        {
                            label: "Rusak Sedang",
                            backgroundColor: "#fdaf4b",
                            borderColor: "#fdaf4b",
                            data: statistikData.map(item => item.sedang),
                        },
                        {
                            label: "Rusak Berat",
                            backgroundColor: "#F25961",
                            borderColor: "#F25961",
                            data: statistikData.map(item => item.berat),
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        position: "bottom",
                    },
                    title: {
                        display: true,
                        text: "Kerusakan Jalan",
                    },
                    tooltips: {
                        mode: "index",
                        intersect: true,
                    },
                    scales: {
                        xAxes: [
                            {
                                stacked: true,
                            },
                        ],
                        yAxes: [
                            {
                                stacked: true,
                                ticks: {
                                    beginAtZero: true,
                                    stepSize: 10,
                                    precision: 0
                                }
                            },
                        ],
                    },
                },
            });
        </script>
    @endpush

</x-layout>
