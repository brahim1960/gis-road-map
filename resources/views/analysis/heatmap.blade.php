<!DOCTYPE html>
<html>
<head>
    <title>Analisis Kepadatan Kerusakan Jalan</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/css/ol.css">
    <script src="https://cdn.jsdelivr.net/gh/openlayers/openlayers.github.io@master/en/v6.5.0/build/ol.js"></script>
    <style>
        .container {
            display: flex;
            padding: 20px;
            gap: 20px;
        }
        .map-container {
            flex: 3;
            position: relative;
        }
        .map {
            width: 100%;
            height: 600px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .info-panel {
            flex: 1;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .legend {
            position: absolute;
            bottom: 20px;
            right: 20px;
            padding: 10px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            z-index: 1000;
        }
        .legend-item {
            display: flex;
            align-items: center;
            margin: 5px 0;
        }
        .legend-color {
            width: 20px;
            height: 20px;
            margin-right: 10px;
            border-radius: 3px;
        }
        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .stats-table th, .stats-table td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
        }
        .stats-table th {
            background-color: #f5f5f5;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="map-container">
        <div id="map" class="map"></div>
        <div class="legend">
            <h4>Tingkat Kepadatan</h4>
            <div class="legend-item">
                <div class="legend-color" style="background:#f00"></div>
                <span>Sangat Tinggi</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background:#ff7f00"></div>
                <span>Tinggi</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background:#ff0"></div>
                <span>Sedang</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background:#0ff"></div>
                <span>Rendah</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background:#00f"></div>
                <span>Sangat Rendah</span>
            </div>
        </div>
    </div>

    <div class="info-panel">
        <h3>Statistik Kerusakan Jalan</h3>
        <table class="stats-table">
            <!-- Statistik Kerusakan Jalan -->
            <!-- Isi tabel dengan data statistik -->
            @foreach($statistics as $stat)
                <tr>
                    <td>{{ $stat->nama_kecamatan }}</td>
                    <td>{{ $stat->total_kerusakan }}</td>
                    <td>{{ $stat->kerusakan_ringan }}</td>
                    <td>{{ $stat->kerusakan_sedang }}</td>
                    <td>{{ $stat->kerusakan_berat }}</td>
                </tr>
                @endforeach
                </tbody></table></div></div>

<script>
    // Fungsi untuk memuat data heatmap dari API
    async function loadHeatmapData() {
        try {
            const response = await fetch('{{ route("api.heatmap-data") }}');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading heatmap data:', error);
            return [];
        }
    }

    // Fungsi untuk mengelompokkan densitas
    function normalizeDensity(density) {
        console.log('Original Density:', density); // Log nilai asli untuk debugging
        if (density <= 2000) {
            return { value: density, category:'Sangat Rendah', weight:density };
        } else if (density <=4000) {
            return { value:density, category:'Rendah', weight:density };
        } else if (density <=6000) {
            return { value:density, category:'Sedang', weight:density };
        } else if (density <=8000) {
            return { value:density, category:'Tinggi', weight:density };
        } else {
            return { value:density, category:'Sangat Tinggi', weight:density };
        }
    }

    // Fungsi untuk menginisialisasi peta
    async function initializeMap() {
        const heatmapData = await loadHeatmapData();

        // Konversi data untuk heat map
        const features = heatmapData.map(item => {
            const geom = JSON.parse(item.geometry);
            const normalized = normalizeDensity(item.density); // Normalisasi densitas

            return new ol.Feature({
                geometry:new ol.geom.Point(ol.proj.fromLonLat([
                    geom.coordinates[0],
                    geom.coordinates[1]
                ])),
                weight : normalized.weight,
                properties :{
                    alamat:item.alamat,
                    tingkat:item.tingkat_kerusakan,
                    kecamatan:item.nama_kecamatan,
                    kategori_densitas : normalized.category
                }
            });
        });

        // Heat map layer dengan gradient warna
        const heatmapLayer = new ol.layer.Heatmap({
            source:new ol.source.Vector({
                features : features
            }),
            blur :1,
            radius :10,
            gradient :[
                '#00f',
                '#0ff',
                '#ff0',
                '#ff7f00',
                '#f00'
            ]
        });

        // Base map
        const map = new ol.Map({
            target:'map',
            layers:[
                new ol.layer.Tile({
                    source:new ol.source.OSM()
                }),
                heatmapLayer
            ],
            view:new ol.View({
                center :ol.proj.fromLonLat([101.4478 ,0.5070]),
                zoom :12
            })
        });

        // Menambahkan kontrol zoom
        map.addControl(new ol.control.Zoom());

        // Menambahkan kontrol skala
        map.addControl(new ol.control.ScaleLine());

        return map;
    }

    // Inisialisasi peta ketika halaman dimuat
    document.addEventListener('DOMContentLoaded', initializeMap);
</script>

</body>
</html>
