// Please Wait (loading) modal definition.
// call myApp.showPleaseWait() to show it,
// and myApp.hidePleaseWait() to hide it.
myApp = function () {
    return {
        showPleaseWait: function () {
            $.mobile.loading('show');
        },
        hidePleaseWait: function () {
            $.mobile.loading('hide');
        }
    };
} ();
var onTagihanSuccess = function (result) {
    var tagihan = result.model;

    $('#bulan').val(tagihan.bulanStr);
    $('#tahun').val(tagihan.tahun);

    alert(tagihan.bulan + '-' + tagihan.tahun);
};
function checkLogin() {
    if (isLogin() === false) {
        window.location.href = 'login.html';
    }
}

function showMessage(message) {
	if (message !== 'Berhasil!') {
		alert(message);
	}
}
function detailPelanggan(id) {
    var setDetailPelanggan = function (result) {
        myApp.hidePleaseWait();
        var model = result.model;

        $('#id-detail-pelanggan').val(model.id);
        $('#tunggakan-detail-pelanggan').val(model.tunggakan);
        $('#status-detail-pelanggan').val(model.status);
        $('#kode-detail-pelanggan').val(model.kode);
        $('#nama-detail-pelanggan').val(model.nama);
        $('#profesi-detail-pelanggan').val(model.profesi);
        $('#nama-kota-detail-pelanggan').val(model.namaKota);
        $('#nama-kecamatan-detail-pelanggan').val(model.namaKecamatan);
        $('#nama-kelurahan-detail-pelanggan').val(model.namaKelurahan);
        $('#lingkungan-detail-pelanggan').val(model.lingkungan);
        $('#keterangan-detail-pelanggan').val(model.detailAlamat);
        $('#telepon-detail-pelanggan').val(model.telepon);
        $('#hp-detail-pelanggan').val(model.hp);
        $('#email-detail-pelanggan').val(model.email);
        $('#tanggal-mulai-detail-pelanggan').val(model.tanggalMulaiStr);
        $('#jumlah-tv-detail-pelanggan').val(model.jumlahTv);
        $('#iuran-detail-pelanggan').val(model.iuran);
    };
	loadPelangganById(id, setDetailPelanggan, errorMessage);
}

function resetPelangganDetail() {
	$('#id-detail-pelanggan').val('');
	$('#tunggakan-detail-pelanggan').val('');
	$('#status-detail-pelanggan').val('');
	$('#kode-detail-pelanggan').val('');
	$('#nama-detail-pelanggan').val('');
	$('#profesi-detail-pelanggan').val('');
	$('#nama-kota-detail-pelanggan').val('');
	$('#nama-kecamatan-detail-pelanggan').val('');
	$('#nama-kelurahan-detail-pelanggan').val('');
	$('#lingkungan-detail-pelanggan').val('');
	$('#keterangan-detail-pelanggan').val('');
	$('#telepon-detail-pelanggan').val('');
	$('#hp-detail-pelanggan').val('');
	$('#email-detail-pelanggan').val('');
	$('#tanggal-mulai-detail-pelanggan').val('');
	$('#jumlah-tv-detail-pelanggan').val('');
	$('#iuran-detail-pelanggan').val('');
}

function sendSMS(pelanggan, partMessage) {
    if (pelanggan != null && pelanggan != undefined) {
        var hp = pelanggan.hp;
        if (hp != null && hp != undefined && hp != '') {
            hp = constructPhoneNumber(hp);
            sendSMSWithNomor(hp, partMessage);
        }
        var telepon = pelanggan.telepon;
        if (telepon != null && telepon != undefined && telepon != '' && telepon.length > 10) {
            telepon = constructPhoneNumber(telepon);
            sendSMSWithNomor(telepon, partMessage);
        }
    }
}

function constructPhoneNumber(number) {
    number = number.replace(' ', '');
    number = number.replace(' ', '');

    number = number.replace('-', '');
    number = number.replace('-', '');

    return number;
}

function sendSMSWithNomor(nomor, partMessage) {
    var namaPerusahaan = getPerusahaan().nama;
    var messageInfo = {
        phoneNumber: nomor,
        textMessage: 'Yth. Pelanggan TV Kabel ' + namaPerusahaan + ', terima kasih atas pembayaran tagihan bulan ' + partMessage + ' anda. SMS ini bisa menjadi bukti pembayaran. Terima kasih.'
    };

    sms.sendMessage(messageInfo, function (message) {
        alert("SMS terkirim");
    }, function (error) {
        alert("SMS tidak terkirim. code: " + error.code + ", message: " + error.message);
    });
}
