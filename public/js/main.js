function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function showNotify(message, type = 'success') {
    $.notify({
        icon: 'fa fa-bell',
        title: 'Jalan Pekanbaru',
        message: message,
    }, {
        type: type,
        placement: {
            from: "top",
            align: "center"
        },
        time: 1000,
    });
}

$("#logout").click(function (e) {
    e.preventDefault();
    swal({
        title: "Logout",
        text: "Apakah anda yakin ingin logout?",
        icon: "warning",
        buttons: {
            cancel: {
                visible: true,
                text: "Tidak",
                className: "btn btn-black",
            },
            confirm: {
                text: "Ya",
                className: "btn btn-danger",
            },
        },
    }).then((willLogout) => {
        if (willLogout) {
        document.getElementById('logout-form').submit();
        }
    });
});

$("#lineChart").sparkline([102, 109, 120, 99, 110, 105, 115], {
    type: "line",
    height: "70",
    width: "100%",
    lineWidth: "2",
    lineColor: "#177dff",
    fillColor: "rgba(23, 125, 255, 0.14)",
});

$("#lineChart2").sparkline([99, 125, 122, 105, 110, 124, 115], {
    type: "line",
    height: "70",
    width: "100%",
    lineWidth: "2",
    lineColor: "#f3545d",
    fillColor: "rgba(243, 84, 93, .14)",
});

$("#lineChart3").sparkline([105, 103, 123, 100, 95, 105, 115], {
    type: "line",
    height: "70",
    width: "100%",
    lineWidth: "2",
    lineColor: "#ffa534",
    fillColor: "rgba(255, 165, 52, .14)",
});

function initImagePreview(fileInputId, previewContainerId) {
    const fileInput = document.getElementById(fileInputId);
    const preview = document.getElementById(previewContainerId);

    if (!fileInput || !preview) return;

    fileInput.addEventListener('change', function () {
        const file = this.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" class="img-fluid mt-2" style="max-width: 100%; height: auto;" />`;
        };
        reader.readAsDataURL(file);
    });
}
