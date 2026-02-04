@props([
    'id',
    'height' => '500px',
    'defaultPoint' => null,
    'kecamatans' => [],
    'editable' => false,
    'showSearch' => false,
    'outlineOnly' => false,
    'zoom' => 12,
    'defaultCenter' => [102.288, -0.372],
    'defaultKecamatanId' => null,
    'defaultAlamat' => null,
    'defaultKecamatanName' => null,
    'kerusakanPoints' => [],
    'radius' => null,
    'jalanSegments' => [],
])

<div id="{{ $id }}" style="position: relative; height: {{ $height }};"></div>

{{-- Tambahkan overlay untuk debugging --}}
<div id="debug-info" style="position: absolute; bottom: 10px; left: 10px; background: rgba(255,255,255,0.8); padding: 5px; border-radius: 4px; font-size: 12px; display: none;">
    <div>Status: <span id="map-status">Menunggu...</span></div>
</div>

@push('scripts')
    <script>
        window.__MAP_INSTANCES__ = window.__MAP_INSTANCES__ || [];

        window.__MAP_INSTANCES__.push({
            id: "{{ $id }}",
            kecamatans: @json($kecamatans),
            editable: {{ $editable ? 'true' : 'false' }},
            showSearch: {{ $showSearch ? 'true' : 'false' }},
            defaultPoint: @json($defaultPoint),
            outlineOnly: {{ $outlineOnly ? 'true' : 'false' }},
            zoom: {{ $zoom }},
            center: @json($defaultCenter),
            kerusakanPoints: @json($kerusakanPoints),
            radius: @json($radius),
            jalanSegments: @json($jalanSegments),
        });

        // Debugging function
        window.showMapDebug = function(show = true) {
            const debugElement = document.getElementById('debug-info');
            if (debugElement) {
                debugElement.style.display = show ? 'block' : 'none';
            }
        };

        // Tampilkan status map
        window.setMapStatus = function(status) {
            const statusElement = document.getElementById('map-status');
            if (statusElement) {
                statusElement.textContent = status;
            }
        };
    </script>
@endpush

@once
    @push('scripts')
        <script src="{{ asset('js/map.js') }}"></script>
    @endpush
@endonce
