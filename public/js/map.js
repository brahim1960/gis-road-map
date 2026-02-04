window.addEventListener('DOMContentLoaded', () => {
    if (!window.__MAP_INSTANCES__) return;
    window.__MAP_INSTANCES__.forEach(initMap);
});

function initMap(config) {
    const mapContainer = document.getElementById(config.id);
    if (!mapContainer) return;

    // Initialize map
    const view = new ol.View({
        center: ol.proj.fromLonLat(config.center),
        zoom: config.zoom,
        maxZoom: 20
    });

    const map = new ol.Map({
        target: config.id,
        view: view,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        controls: ol.control.defaults.defaults().extend([
            new ol.control.ZoomSlider(),
            new ol.control.ScaleLine(),
            new ol.control.OverviewMap({
                layers: [new ol.layer.Tile({
                    source: new ol.source.OSM()
                })],
                collapsed: false,
                className: 'ol-overviewmap ol-custom-overviewmap'
            })
        ])
    });

    // Popup management
    let popupOverlay = null;
    let isPopupOpen = false;

    function createPopup() {
        // Remove existing popup if any
        if (popupOverlay) {
            map.removeOverlay(popupOverlay);
        }

        // Create popup element
        const popupElement = document.createElement('div');
        popupElement.className = 'ol-popup';
        popupElement.innerHTML = `
            <a href="#" class="ol-popup-closer" id="popup-closer-${config.id}"></a>
            <div class="ol-popup-content" id="popup-content-${config.id}"></div>
        `;

        popupOverlay = new ol.Overlay({
            element: popupElement,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });

        map.addOverlay(popupOverlay);

        // Add close button event
        const closer = popupElement.querySelector('.ol-popup-closer');
        closer.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closePopup();
        });

        return popupElement;
    }

    function showPopup(coordinate, htmlContent) {
        if (!popupOverlay) {
            createPopup();
        }

        const contentElement = popupOverlay.getElement().querySelector('.ol-popup-content');
        if (contentElement) {
            contentElement.innerHTML = htmlContent;
            popupOverlay.setPosition(coordinate);
            isPopupOpen = true;
        }
    }

    function closePopup() {
        if (popupOverlay) {
            popupOverlay.setPosition(undefined);
            isPopupOpen = false;
        }
    }

    // Initialize popup
    createPopup();

    // Kecamatan layer setup
    const vectorSource = new ol.source.Vector();
    const kecamatanStyle = function (feature) {
        const showOutlineOnly = config.outlineOnly || false;

        return new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#a46873',
                width: 2
            }),
            fill: showOutlineOnly ? null : new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.5)'
            }),
            text: new ol.style.Text({
                text: feature.get('nama_kecamatan') ? feature.get('nama_kecamatan').toUpperCase() : '',
                font: 'bold 12px sans-serif',
                fill: new ol.style.Fill({
                    color: '#4a4a79'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 3
                }),
                offsetY: 0,
                textAlign: 'center',
                textBaseline: 'middle'
            })
        });
    }

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: kecamatanStyle
    });
    map.addLayer(vectorLayer);

    // Process kecamatan features
    const format = new ol.format.GeoJSON();
    const kecamatanFeatures = (config.kecamatans || []).map(k => {
        try {
            if (!k.area) return null;

            const geoJsonData = {
                "type": "Feature",
                "geometry": k.area,
                "properties": {
                    "id": k.id,
                    "nama_kecamatan": k.nama_kecamatan
                }
            };

            const f = format.readFeature(geoJsonData, {
                featureProjection: 'EPSG:3857'
            });

            f.set('kecamatan_id', k.id);
            f.set('nama_kecamatan', k.nama_kecamatan);

            return f;
        } catch (error) {
            console.error('Error saat membuat fitur:', error);
            return null;
        }
    }).filter(f => f !== null);

    if (kecamatanFeatures.length > 0) {
        vectorSource.addFeatures(kecamatanFeatures);

        const extent = vectorSource.getExtent();
        if (!ol.extent.isEmpty(extent)) {
            map.getView().fit(extent, {
                padding: [50, 50, 50, 50],
                maxZoom: 18
            });
        }
    }

    function setMarker(coordinate) {
        const overlays = map.getOverlays().getArray();
        overlays.forEach(o => {
            if (o.get('marker') && o !== popupOverlay) {
                map.removeOverlay(o);
            }
        });

        const el = document.createElement('div');
        el.className = 'marker-pin';
        el.innerHTML = `<i class="fas fa-map-marker-alt" style="color:#936920;"></i>`;

        const overlay = new ol.Overlay({
            position: coordinate,
            positioning: 'bottom-center',
            element: el,
            offset: [0, 0.5]
        });
        overlay.set('marker', true);
        map.addOverlay(overlay);
    }

    function checkKecamatan(lon, lat, marker = true) {
        const coord = ol.proj.fromLonLat([lon, lat]);
        const feature = kecamatanFeatures.find(f =>
            f.getGeometry().intersectsCoordinate(coord)
        );

        const namaInput = document.getElementById('nama_kecamatan');
        const idInput = document.getElementById('kecamatan');

        if (!namaInput || !idInput) return;

        if (feature) {
            if (marker) setMarker(coord);
            namaInput.value = toTitleCase(feature.get('nama_kecamatan') || '');
            idInput.value = feature.get('kecamatan_id') || '';
        } else {
            namaInput.value = '';
            idInput.value = '';
            if (typeof showNotify !== 'undefined') {
                showNotify('Titik berada di luar wilayah kecamatan yang tersedia', 'danger');
            }
        }
    }

    // Handle default point
    if (config.defaultPoint) {
        let oldPoint = config.defaultPoint;
        if (!oldPoint) {
            const pointInput = document.getElementById('point');
            if (pointInput && pointInput.value) {
                oldPoint = pointInput.value;
            }
        }
        if (oldPoint) {
            const match = oldPoint.match(/POINT\((.*?)\)/);
            if (match) {
                const [lon, lat] = match[1].split(' ').map(parseFloat);
                const coord = ol.proj.fromLonLat([lon, lat]);
                setMarker(coord);
                vectorSource.addFeature(new ol.Feature({ geometry: new ol.geom.Point(coord) }));
                map.getView().setCenter(coord);
                map.getView().setZoom(17);
                checkKecamatan(lon, lat, false);
            }
        }
    }

    // Editable map functionality
    if (config.editable) {
        map.on('click', function (evt) {
            closePopup();

            const lonLat = ol.proj.toLonLat(evt.coordinate);
            const pointInput = document.getElementById('point');
            if (pointInput) {
                pointInput.value = `POINT(${lonLat[0]} ${lonLat[1]})`;
            }

            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lonLat[1]}&lon=${lonLat[0]}`)
                .then(res => res.json())
                .then(data => {
                    const alamatInput = document.getElementById('alamat');
                    if (!alamatInput) return;

                    if (data?.address?.road) {
                        alamatInput.value = data.address.road;
                    } else if (data?.name) {
                        alamatInput.value = data.name;
                    } else {
                        alamatInput.value = '';
                        if (typeof showNotify !== 'undefined') {
                            showNotify('Alamat tidak ditemukan, silahkan isi secara manual di kolom alamat', 'danger');
                        }
                    }
                })
                .catch(() => {
                    if (typeof showNotify !== 'undefined') {
                        showNotify('Gagal mengambil alamat dari koordinat', 'danger');
                    }
                });

            checkKecamatan(lonLat[0], lonLat[1], true);
        });
    }

    // Search functionality
    if (config.showSearch) {
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            position: absolute;
            top: 10px;
            left: 45px;
            z-index: 1000;
            width: 280px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            overflow: hidden;
            max-height: 250px;
            display: flex;
            flex-direction: column;
        `;

        const input = document.createElement('input');
        input.className = 'form-control';
        input.placeholder = 'Cari lokasi...';
        input.style.cssText = `
            border: none;
            border-bottom: 1px solid #ccc;
            border-radius: 0;
            padding: 10px;
        `;

        const results = document.createElement('div');
        results.style.cssText = `
            flex: 1;
            overflow-y: auto;
            max-height: 200px;
            background: #fff;
            display: none;
        `;

        wrapper.appendChild(input);
        wrapper.appendChild(results);
        mapContainer.appendChild(wrapper);

        let timeout;
        input.addEventListener('input', function () {
            clearTimeout(timeout);
            results.innerHTML = '';
            if (input.value.length < 3) {
                results.style.display = 'none';
                return;
            }

            timeout = setTimeout(() => {
                const q = encodeURIComponent(input.value + ' Indragiri Hulu, Indonesia');
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=5`)
                    .then(r => r.json())
                    .then(data => {
                        results.innerHTML = '';
                        if (data.length > 0) {
                            results.style.display = 'block';
                            data.forEach(item => {
                                const div = document.createElement('div');
                                div.innerText = item.display_name;
                                div.style.cssText = `
                                    cursor: pointer;
                                    padding: 8px 12px;
                                    border-bottom: 1px solid #eee;
                                `;

                                div.addEventListener('mouseenter', () => {
                                    div.style.backgroundColor = '#f5f5f5';
                                });
                                div.addEventListener('mouseleave', () => {
                                    div.style.backgroundColor = 'white';
                                });

                                div.addEventListener('click', () => {
                                    const lon = parseFloat(item.lon);
                                    const lat = parseFloat(item.lat);
                                    const coord = ol.proj.fromLonLat([lon, lat]);
                                    map.getView().animate({ center: coord, zoom: 17 });
                                    results.style.display = 'none';
                                    input.value = '';
                                });

                                results.appendChild(div);
                            });
                        } else {
                            const div = document.createElement('div');
                            div.innerText = 'Tidak ditemukan';
                            div.style.cssText = 'padding: 8px 12px; color: #999;';
                            results.appendChild(div);
                            results.style.display = 'block';
                        }
                    })
                    .catch(() => {
                        results.innerHTML = '<div style="padding: 8px 12px; color: #999;">Error pencarian</div>';
                        results.style.display = 'block';
                    });
            }, 300);
        });

        document.addEventListener('click', e => {
            if (!wrapper.contains(e.target)) {
                results.style.display = 'none';
            }
        });
    }

    if (config.radius > 0 && Array.isArray(config.kerusakanPoints) && Array.isArray(config.jalanSegments)) {
        const validSegments = config.jalanSegments.filter(s => {
            try {
                const geom = typeof s.geometry === 'string' ? JSON.parse(s.geometry) : s.geometry;
                return geom && geom.coordinates && geom.coordinates.length > 0;
            } catch (e) {
                return false;
            }
        });

        const roadLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: feature => {
                const density = parseFloat(feature.get('nkde_value')) || 0;
                const type = (feature.get('type') || '').toLowerCase();

                let width = 2;
                if (type.includes('primary') || type.includes('arteri')) width = 5;
                else if (type.includes('secondary') || type.includes('kolektor')) width = 4;
                else if (type.includes('tertiary') || type.includes('lokal')) width = 3;

                let color;

                if (density <= 0.000001) color = 'rgba(52, 152, 219, 0.7)';
                else if (density <= 0.000003) color = 'rgb(58,189,29)';
                else if (density <= 0.000005) color = 'rgba(255, 255, 0, 1)';
                else if (density <= 0.00001) color = 'rgba(255, 165, 0, 1)';
                else color = 'rgba(255,0,0,1)';

                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color,
                        width,
                        lineCap: 'round',
                        lineJoin: 'round'
                    }),
                    zIndex: Math.round(density * 10000000)
                });
            }
        });

        validSegments.forEach(seg => {
            try {
                const geom = typeof seg.geometry === 'string' ? JSON.parse(seg.geometry) : seg.geometry;
                const coords = geom.type === 'LineString'
                    ? geom.coordinates.map(c => ol.proj.fromLonLat(c))
                    : geom.coordinates.map(ls => ls.map(c => ol.proj.fromLonLat(c)));

                const geometry = geom.type === 'LineString'
                    ? new ol.geom.LineString(coords)
                    : new ol.geom.MultiLineString(coords);

                const feature = new ol.Feature({ geometry });
                feature.setProperties({
                    id: seg.id,
                    nama_jalan: seg.nama_jalan || 'Tidak diketahui',
                    nkde_value: parseFloat(seg.nkde_value) || 0,
                    type: seg.type || '-',
                    segment_length: parseFloat(seg.segment_length) || 0
                });

                roadLayer.getSource().addFeature(feature);
            } catch (e) {
                console.warn('Failed to add segment', seg.id, e);
            }
        });

        map.addLayer(roadLayer);

        if (roadLayer.getSource().getFeatures().length > 0) {
            const extent = roadLayer.getSource().getExtent();
            if (extent && !ol.extent.isEmpty(extent)) {
                map.getView().setCenter(ol.proj.fromLonLat([102.288, -0.372]));
                map.getView().setZoom(10);
            }
        }

        // Pop-up
        map.on('singleclick', function (e) {
            const feature = map.forEachFeatureAtPixel(e.pixel, function (feat) {
                return feat;
            });

            if (feature) {
                const props = feature.getProperties();
                const html = `
                    <div class="container-fluid p-0" style="max-width: 500px;">
                        <div style="max-height: 400px;">
                            <table class="table table-sm table-bordered mb-0">
                                <tbody>
                                    <tr>
                                        <td class="fw-bold">Nama Jalan</td>
                                        <td>${props.nama_jalan}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Jenis Jalan</td>
                                        <td>${props.type}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Panjang</td>
                                        <td>${Math.round(props.segment_length)} Meter</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Kepadatan</td>
                                        <td>${props.nkde_value.toFixed(11)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;

                showPopup(e.coordinate, html);
            }
        });
    }

    // Kerusakan points
    if (Array.isArray(config.kerusakanPoints)) {
        config.kerusakanPoints.forEach(point => {
            if (!point.lon || !point.lat) return;

            const coordinate = ol.proj.fromLonLat([parseFloat(point.lon), parseFloat(point.lat)]);

            // Create marker element
            const icon = document.createElement('div');
            icon.className = 'marker-pin';
            icon.style.cssText = 'pointer-events: none; position: relative;'; // Important: disable pointer events on container

            const kerusakanClass = {
                ringan: 'text-info',
                sedang: 'text-warning',
                berat: 'text-danger'
            }[point.tingkat_kerusakan] || 'text-secondary';

            // Create clickable icon inside
            const iconElement = document.createElement('i');
            iconElement.className = `fas fa-map-marker-alt ${kerusakanClass}`;
            iconElement.style.cssText = 'font-size: 20px; cursor: pointer; pointer-events: auto;'; // Re-enable pointer events only for icon

            icon.appendChild(iconElement);

            const overlay = new ol.Overlay({
                position: coordinate,
                positioning: 'bottom-center',
                element: icon,
                offset: [0, 0.5]
            });

            overlay.set('marker', true);
            overlay.set('pointData', point);
            map.addOverlay(overlay);

            // Add click event only to the icon element
            iconElement.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                const formatTanggal = (dateString) => {
                    if (!dateString) return '-';
                    const date = new Date(dateString);
                    if (isNaN(date)) return '-';
                    return date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    });
                };

                const html = `
                    <div class="container-fluid p-0" style="max-width: 500px;">
                        <div style="max-height: 400px;">
                            <table class="table table-sm table-bordered mb-0">
                                <tbody>
                                    <tr>
                                        <td class="fw-bold">Alamat</td>
                                        <td>${typeof toTitleCase !== 'undefined' ? toTitleCase(point.alamat) : point.alamat || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">STA</td>
                                        <td>${
                                            (point.km_awal != null || point.m_awal != null || point.km_akhir != null || point.m_akhir != null)
                                                ? `${point.km_awal ?? ''} + ${point.m_awal ?? ''} <br> ${point.km_akhir ?? ''} + ${point.m_akhir ?? ''}`
                                                : '-'
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Panjang</td>
                                        <td>${point.panjang ? point.panjang + ' Meter' : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Lebar</td>
                                        <td>${point.lebar ? point.lebar + ' Meter' : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Tinggi</td>
                                        <td>${point.tinggi ? point.tinggi + ' Meter' : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Tingkat Kerusakan</td>
                                        <td>
                                            <span class="badge ${point.tingkat_kerusakan === 'ringan' ? 'bg-info' :
                                                point.tingkat_kerusakan === 'sedang' ? 'bg-warning' :
                                                point.tingkat_kerusakan === 'berat' ? 'bg-danger' : 'bg-secondary'}">
                                                ${typeof toTitleCase !== 'undefined' ? toTitleCase(point.tingkat_kerusakan) : point.tingkat_kerusakan || '-'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Tanggal</td>
                                        <td>${formatTanggal(point.tanggal)}</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Deskripsi</td>
                                        <td>${point.deskripsi || '-'}</td>
                                    </tr>
                                    ${point.gambar_url || point.gambar ? `
                                    <tr>
                                        <td class="fw-bold">Gambar</td>
                                        <td>
                                            <img src="${point.gambar_url || point.gambar}"
                                                 alt="Gambar kerusakan"
                                                 class="img-thumbnail"
                                                 style="max-width: 150px; cursor: pointer;"
                                                 onclick="openImageModal('${point.gambar_url || point.gambar}')">
                                        </td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td class="fw-bold">Jenis Kerusakan</td>
                                        <td>${typeof toTitleCase !== 'undefined' ?
                                            toTitleCase(point.jenis_kerusakan?.nama_kerusakan || point.jenis_kerusakan_nama) :
                                            (point.jenis_kerusakan?.nama_kerusakan || point.jenis_kerusakan_nama || '-')}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold">Kecamatan</td>
                                        <td>${typeof toTitleCase !== 'undefined' ?
                                            toTitleCase(point.kecamatan?.nama_kecamatan || point.kecamatan_nama) :
                                            (point.kecamatan?.nama_kecamatan || point.kecamatan_nama || '-')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;

                showPopup(coordinate, html);
            });
        });
    }

    // Map click handler - close popup when clicking outside markers
    map.on('click', function(evt) {
        // Check if click is on a marker
        let clickedOnMarker = false;
        const pixel = evt.pixel;

        map.getOverlays().forEach(overlay => {
            if (overlay.get('marker') && overlay !== popupOverlay) {
                const overlayPixel = map.getPixelFromCoordinate(overlay.getPosition());
                if (overlayPixel) {
                    const distance = Math.sqrt(
                        Math.pow(pixel[0] - overlayPixel[0], 2) +
                        Math.pow(pixel[1] - overlayPixel[1], 2)
                    );
                    if (distance < 30) {
                        clickedOnMarker = true;
                    }
                }
            }
        });

        if (!clickedOnMarker && isPopupOpen) {
            closePopup();
        }
    });

    // Close popup with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isPopupOpen) {
            closePopup();
        }
    });

    // Global image modal function
    window.openImageModal = function(imageSrc) {
        const existingModal = document.querySelector('.image-modal-overlay');
        if (existingModal) {
            existingModal.remove();
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'image-modal-overlay';
        modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        cursor: pointer;
        padding: 20px;
        box-sizing: border-box;
    `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
        position: relative;
        max-width: 100%;
        max-height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: default;
    `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(10px);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 2px 15px rgba(0,0,0,0.4);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    `;

        // Hover effect untuk close button
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(244, 67, 54, 0.9)';
            closeBtn.style.color = 'white';
            closeBtn.style.transform = 'scale(1.1)';
        });

        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255,255,255,0.9)';
            closeBtn.style.color = 'black';
            closeBtn.style.transform = 'scale(1)';
        });

        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
        position: relative;
        max-width: 100%;
        max-height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Gambar kerusakan';
        img.style.cssText = `
        max-width: 100%;
        max-height: 100vh;
        width: auto;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        object-fit: contain;
        display: block;
    `;

        // Loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 18px;
        z-index: 10000;
    `;
        loadingDiv.innerHTML = 'Loading...';

        imgContainer.appendChild(loadingDiv);
        imgContainer.appendChild(img);
        modalContent.appendChild(imgContainer);
        modalOverlay.appendChild(modalContent);
        modalOverlay.appendChild(closeBtn); // Pindahkan close button ke overlay level

        // Handle image load
        img.onload = function() {
            loadingDiv.style.display = 'none';

            // Responsive adjustments berdasarkan orientasi gambar
            const imgAspectRatio = this.naturalWidth / this.naturalHeight;
            const windowAspectRatio = window.innerWidth / window.innerHeight;

            if (imgAspectRatio > windowAspectRatio) {
                // Gambar lebih lebar (landscape)
                this.style.maxWidth = '90vw';
                this.style.maxHeight = '80vh';
            } else {
                // Gambar lebih tinggi (portrait)
                this.style.maxWidth = '80vw';
                this.style.maxHeight = '90vh';
            }

            // Untuk gambar yang sangat kecil, pastikan minimal size
            if (this.naturalWidth < 300 || this.naturalHeight < 300) {
                this.style.minWidth = '300px';
                this.style.minHeight = 'auto';
            }
        };

        // Handle image load error
        img.onerror = function() {
            loadingDiv.innerHTML = 'Gagal memuat gambar';
            loadingDiv.style.color = '#f44336';
        };

        document.body.appendChild(modalOverlay);

        // Close handlers
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modalOverlay.style.transform = 'scale(0.9)';
            setTimeout(() => modalOverlay.remove(), 200);
        };

        // Smooth entry animation
        modalOverlay.style.opacity = '0';
        modalOverlay.style.transform = 'scale(0.9)';
        modalOverlay.style.transition = 'all 0.2s ease';

        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalOverlay.style.transform = 'scale(1)';
        }, 10);

        closeBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });

        // Prevent content click from closing modal
        modalContent.addEventListener('click', (e) => e.stopPropagation());

        // ESC key handler
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Handle window resize
        const resizeHandler = () => {
            if (img.complete && img.naturalWidth > 0) {
                const imgAspectRatio = img.naturalWidth / img.naturalHeight;
                const windowAspectRatio = window.innerWidth / window.innerHeight;

                if (imgAspectRatio > windowAspectRatio) {
                    img.style.maxWidth = '90vw';
                    img.style.maxHeight = '80vh';
                } else {
                    img.style.maxWidth = '80vw';
                    img.style.maxHeight = '90vh';
                }
            }
        };

        window.addEventListener('resize', resizeHandler);

        // Cleanup resize handler when modal closes
        const originalRemove = modalOverlay.remove;
        modalOverlay.remove = function() {
            window.removeEventListener('resize', resizeHandler);
            document.removeEventListener('keydown', escHandler);
            originalRemove.call(this);
        };
    };
}
