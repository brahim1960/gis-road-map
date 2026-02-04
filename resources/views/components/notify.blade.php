@if(session()->has('success'))
    <script>
        $.notify({
            icon: 'icon-bell',
            title: 'Jalan Pekanbaru',
            message: '{{ session('success') }}',
        },{
            type: 'success',
            placement: {
                from: "top",
                align: "center"
            },
            time: 1000,
        });
    </script>
@endif

@if(session()->has('error'))
    <script>
        $.notify({
            icon: 'icon-bell',
            title: 'Jalan Pekanbaru',
            message: '{{ session('error') }}',
        },{
            type: 'danger',
            placement: {
                from: "top",
                align: "center"
            },
            time: 1000,
        });
    </script>
@endif
