<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 Not Found</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ url('assets/css/bootstrap.min.css') }}">
    <link rel="stylesheet" href="{{ url('assets/css/app.css') }}">
    <link rel="stylesheet" href="{{ url('assets/css/error.css') }}">
    <link rel="stylesheet" href="{{ url('css/style.css') }}">
</head>

<body>
    <div id="error">
        <div class="error-page container d-flex justify-content-center align-items-center min-vh-100">
            <div class="col-md-8 col-12">
                <div class="text-center">
                    <img class="img-error img-fluid mx-auto d-block" src="{{ url('assets/img/undraw/undraw_page_not_found_su7k.svg') }}" alt="Not Found">
                    <h1 class="error-title mb-0">NOT FOUND</h1>
                    <p class='h6 text-gray-600 mb-3 mb-md-2'>Halaman yang anda cari tidak ditemukan.</p>
                    <a href="{{ url('/') }}" class="btn btn-lg btn-primary">Kembali ke Home</a>
                </div>
            </div>
        </div>
    </div>
</body>

</html>
