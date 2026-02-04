<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analisis Hotspot Kerusakan Jalan</title>

    <!-- OpenLayers CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v7.4.0/ol.css">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        .map {
            height: 600px;
            width: 100%;
            background-color: #f8f9fa;
        }
        .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
        }
        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 8px;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
<div class="container-fluid py-3">
    <div class="row">
        <div class="col-md-9">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title">Analisis Hotspot Kerusakan Jalan (Getis-Ord Gi*)</h5>
                </div>
                <div class="card-body">
                    <div id="map" class="map"></div>
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title">Statistik Hotspot per Kecamatan</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead>
                            <tr>
                                <th>Kecamatan</th>
                                <th>Total Titik</th>
                                <th>Hotspot</th>
                            </tr>
                            </thead>
                            <tbody id="statisticsBody">
                            <!-- Data akan diisi melalui JavaScript -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card mt-3">
                <div class="card-header">
                    <h5 class="card-title">Keterangan</h5>
                </div>
                <div class="card-body">
                    <div class="legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #dc3545;"></div>
                            <span>Hotspot Sangat Tinggi (Gi* > 2.58)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #ffc107;"></div>
                            <span>Hotspot Tinggi (1.96 < Gi* ≤ 2.58)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #17a2b8;"></div>
                            <span>Hotspot Sedang (1.65 < Gi* ≤ 1.96)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #6c757d;"></div>
                            <span>Random (-1.65 ≤ Gi* ≤ 1.65)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #007bff;"></div>
                            <span>Coldspot Sedang (-1.96 ≤ Gi* < -1.65)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #28a745;"></div>
                            <span>Coldspot Tinggi (-2.58 ≤ Gi* < -1.96)</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #343a40;"></div>
                            <span>Coldspot Sangat Tinggi (Gi* < -2.58)</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- OpenLayers -->
<script src="https://cdn.jsdelivr.net/npm/ol@v7.4.0/dist/ol.js"></script>
<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
    // Inisialisasi peta
    const map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([101.4478, 0.5070]),
            zoom: 11
        })
    });

    // Style function untuk titik hotspot
    function getPointStyle(feature) {
        const significance = feature.get('significance_level');
        let color;

        switch(significance) {
            case 'Hotspot Sangat Tinggi':
                color = '#dc3545';
                break;
            case 'Hotspot Tinggi':
                color = '#ffc107';
                break;
            case 'Hotspot Sedang':
                color = '#17a2b8';
                break;
            case 'Random':
                color = '#6c757d';
                break;
            case 'Coldspot Sedang':
                color = '#007bff';
                break;
            case 'Coldspot Tinggi':
                color = '#28a745';
                break;
            case 'Coldspot Sangat Tinggi':
                color = '#343a40';
                break;
            default:
                color = '#000000';
        }

        return new ol.style.Style({
            image: new ol.style.Circle({
                radius: 8,
                fill: new ol.style.Fill({ color: color }),
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 1
                })
            })
        });
    }

    // Popup overlay
    const popup = new ol.Overlay({
        element: document.createElement('div'),
        positioning: 'bottom-center',
        stopEvent: false
    });
    popup.getElement().className = 'ol-popup';
    map.addOverlay(popup);

    // Fetch data dan tambahkan ke peta
    fetch('/api/hotspot-analysis')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const features = data.map(point => {
                const geometry = JSON.parse(point.geometry);
                return new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.fromLonLat([
                            geometry.coordinates[0],
                            geometry.coordinates[1]
                        ])
                    ),
                    alamat: point.alamat,
                    tingkat_kerusakan: point.tingkat_kerusakan,
                    gi_star: point.gi_star,
                    significance_level: point.significance_level
                });
            });

            const vectorSource = new ol.source.Vector({
                features: features
            });

            const vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: getPointStyle
            });

            map.addLayer(vectorLayer);

            // Event handler untuk popup
            const popupElement = popup.getElement();
            map.on('click', function(evt) {
                const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    return feature;
                });

                if (feature) {
                    const coordinates = feature.getGeometry().getCoordinates();
                    popupElement.innerHTML = `
                            <div class="card" style="min-width: 200px;">
                                <div class="card-body">
                                    <p><strong>Alamat:</strong> ${feature.get('alamat')}</p>
                                    <p><strong>Tingkat Kerusakan:</strong> ${feature.get('tingkat_kerusakan')}</p>
                                    <p><strong>Nilai Gi*:</strong> ${feature.get('gi_star').toFixed(3)}</p>
                                    <p><strong>Klasifikasi:</strong> ${feature.get('significance_level')}</p>
                                </div>
                            </div>
                        `;
                    popup.setPosition(coordinates);
                } else {
                    popup.setPosition(undefined);
                }
            });
        });

    // Fetch data dengan error handling
    fetch('/api/hotspot-analysis')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const features = data.map(point => {
                const geometry = JSON.parse(point.geometry);
                return new ol.Feature({
                    geometry: new ol.geom.Point(
                        ol.proj.fromLonLat([
                            geometry.coordinates[0],
                            geometry.coordinates[1]
                        ])
                    ),
                    alamat: point.alamat,
                    tingkat_kerusakan: point.tingkat_kerusakan,
                    gi_star: point.gi_star,
                    significance_level: point.significance_level
                });
            });

            const vectorSource = new ol.source.Vector({
                features: features
            });

            const vectorLayer = new ol.layer.Vector({
                source: vectorSource,
                style: getPointStyle
            });

            map.addLayer(vectorLayer);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengambil data hotspot');
        });

    // Fetch statistik dengan error handling
    fetch('/api/hotspot-statistics')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('statisticsBody');
            data.forEach(stat => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${stat.nama_kecamatan}</td>
                <td>${stat.total_titik}</td>
                <td>${stat.total_hotspot}</td>
            `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengambil data statistik');
        });
</script>
</body>
</html>
