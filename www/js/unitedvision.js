/* UnitedVision. 2014
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com
 * 
 * Version: 4.1.0
 */

var target = 'https://uvision.whelastic.net/tvkabel/api';

// Please wait variable.
// This will/must be set from application's specific script.
var myApp;
// Default error callback
var errorMessage = function (jqXHR, textStatus, errorThrown) {
    alert('Error : ' + textStatus + ' - ' + errorThrown);
}
// Default callback
var emptyFunction = function () {
	// do nothing
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function getOperator() {
    var operator = localStorage.getItem('operator');
    return JSON.parse(operator);
}
function setOperator(operator) {
	localStorage.setItem('operator', JSON.stringify(operator));
	localStorage.setItem('username', operator.username);
	localStorage.setItem('password', operator.password);
}
function resetOperator() {
	var notAuthenticated = {
		username: '',
		password: ''
	};
	
	setOperator(notAuthenticated);
}
function getUsername() {
	return localStorage.getItem('username');
}
function getPassword() {
	return localStorage.getItem('password');
}
function getPerusahaan() {
	var operator = getOperator();
	return operator.perusahaan;
}
function getIdPerusahaan() {
	var perusahaan = getPerusahaan();
	return perusahaan.id;
}
function isLogin() {
	var x = localStorage.getItem('login');
	if (x == 'true')
	    return true;
	return false;
}
function setLogin(condition) {
	localStorage.setItem('login', condition);
}
function login(username, password) {
	var data = {
		username: username,
		password: password
	};
	var onSuccess = function (result) {
	    if (result.message === 'Berhasil!') {
			setLogin(true);
	        setOperator(result.model);

	        alert('Berhasil Login - Selamat Datang ' + result.model.nama + ' dari ' + result.model.perusahaan.nama);
	        window.location.href = "dashboard.html";
		} else {
			alert(result.message);
	    }
	};
	process(target + '/login', data, 'POST', onSuccess, errorMessage);
}
function logout() {
	myApp.showPleaseWait();
	setLogin(false);
	resetOperator();
	myApp.hidePleaseWait();
	window.location.href = 'index.html';
	alert('Berhasil Logout');

	// This is alternate version of logout (client logout)
	// The service still have bug, it always return HTTP 500 (Internal Server Error)
	/*  $.ajax({
        type: 'POST',
        beforeSend: OnBeforeAjaxRequest,
        url: target + '/logout',
        username: getUsername(),
        password: getPassword(),
        contentType: 'application/json',
        xhrFields: {
            withCredentials: true
        },
        success: function (result) {
            myApp.hidePleaseWait();
            alert('Berhasil Logout');
        },
        error: errorMessage
    }); */
}
function process(url, data, method, success, error) {
	var _username = getUsername();
	var _password = getPassword();
	
	if (_username !== '' || password !== '') {
	    var promise = $.ajax({
	        type: method,
	        url: url,
	        username: _username,
	        password: _password,
	        contentType: 'application/json',
	        crossDomain: true,
	        processData: false,
	        data: JSON.stringify(data),
	        beforeSend: function (jqXHR, settings) {
				jqXHR.setRequestHeader('Origin', 'https://uvs-t001.whelastic.net');
	            myApp.showPleaseWait()
	        }
	    });
		
	    promise.done(success);
	    promise.fail(error);
	    promise.always(function (jqXHR, textStatus) {
	        myApp.hidePleaseWait();
	    });
	} else {
		window.location.href = 'index.html';
	}
}
function save(url, data, method, success, error) {
	process(url, data, method, success, error);
}
function load(url, success, error) {
	process(url, '', 'GET', success, error);
}
function submitPost(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
         }
    }

    document.body.appendChild(form);
    form.submit();
}
function savePerusahaan(data, success, error) {
	save(target + '/perusahaan/master', data, 'POST', success, error);
}
function loadPerusahaanById(id, success, error) {
	load(target + '/perusahaan/id/' + id, success, error);
}
function loadPerusahaanByKode(kode, success, error) {
	load(target + '/perusahaan/kode/' + kode, success, error);
}
function loadActivePerusahaan(success, error) {
	load(target + '/perusahaan/active', success, error);
}
function loadRekapPerusahaan(success, error) {
	load(target + '/perusahaan/' + getIdPerusahaan() + '/rekap', success, error);
}
function loadRekapAktifPerusahaan(success, error) {
	load(target + '/perusahaan/active/rekap', success, error);
}
function loadAllPerusahaan(success, error) {
	load(target + '/perusahaan', success, error);
}
function registrasiPerusahaan(data, success, error) {
	save(target + '/perusahaan/registrasi', data, 'POST', success, error);
}
function savePegawai(data, success, error) {
	save(target + '/pegawai/perusahaan/' + getIdPerusahaan() + '/master', data, 'POST', success, error);
}
function deletePegawai(id, success, error) {
	save(target + '/pegawai/removed/master', id, 'POST', success, error);
}
function loadActivePegawai(success, error) {
	load(target + '/pegawai/active', success, error);
}
function loadPegawaiById(id, success, error) {
	load(target + '/pegawai/id/' + id, success, error);
}
function loadPegawaiByKode(kode, success, error) {
	load(target + '/pegawai/perusahaan/' + getIdPerusahaan() + '/kode/' + kode, success, error);
}
function loadPegawaiByNama(nama, success, error) {
	load(target + '/pegawai/perusahaan/' + getIdPerusahaan() + '/nama/' + nama, success, error);
}
function loadListPegawaiByKode(kode, page, success, error) {
	load(target + '/pegawai/perusahaan/' + getIdPerusahaan() + '/kode/' + kode + '/page/' + page, success, error)
}
function loadListPegawaiByNama(nama, page, success, error) {
	load(target + '/pegawai/perusahaan/' + getIdPerusahaan() + '/nama/' + nama + '/page/' + page, success, error);
}
function loadAllPegawai(success, error) {
	load(target + '/pegawai/perusahaan/' + getIdPerusahaan(), success, error);
}
function savePelanggan(data, success, error) {
	save(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/master', data, 'POST', success, error);
}
function updateTunggakan(id, data, success, error) {
	save(target + '/pelanggan/' + id + '/tunggakan/master', data, 'PUT', success, error);
}
function setPelangganMapLocation(id, latitude, longitude, success, error) {
	save(target + '/pelanggan/' + id + '/location/' + latitude + '/' + longitude, '', "PUT", success, error);
}
function activatePelanggan(id, success, error) {
	save(target + '/pelanggan/activated/master', id, 'PUT', success, error);
}
function passivatePelanggan(id, success, error) {
	save(target + '/pelanggan/passivated/master', id, 'PUT', success, error);
}
function banPelanggan(id, success, error) {
	save(target + '/pelanggan/banned/master', id, 'PUT', success, error);
}
function freePelanggan(id, success, error) {
	save(target + '/pelanggan/free/master', id, 'PUT', success, error);
}
function deletePelanggan(id, success, error) {
	save(target + '/pelanggan/removed/master', id, 'PUT', success, error);
}
function loadPelangganById(id, success, error) {
	load(target + '/pelanggan/id/' + id, success, error);
}
function loadPelangganByKode(kode, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/kode/' + kode, success, error);
}
function loadListPelangganByKode(kode, page, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/kode/' + kode + '/page/' + page, success, error);
}
function loadListPelangganByKodeAndStatus(kode, status, page, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/kode/' + kode + '/status/' + status + '/page/' + page, success, error);
}
function loadPelangganByNama(nama, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/nama/' + nama, success, error);
}
function loadListPelangganByNama(nama, page, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/nama/' + nama + '/page/' + page, success, error);
}
function loadListPelangganByNamaAndStatus(nama, status, page, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/nama/' + nama + '/status/' + status + '/page/' + page, success, error);
}
function loadListPelangganByNomor(nomor, page, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/nomor/' + nomor + '/page/' + page, success, error);
}
function loadListPelangganByNomorAndStatus(nomor, status, page, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/nomor/' + nomor + '/status/' + status + '/page/' + page, success, error);
}
function loadListPelangganByStatus(status, page, success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/status/' + status + '/page/' + page, success, error);
}
function loadAllPelanggan(success, error) {
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan(), success, error);
}
function savePembayaran(data, success, error) {
	save(target + '/pembayaran/master', data, 'POST', success, error);
}
function updatePembayaran(data, success, error) {
	save(target + '/pembayaran/master', data, 'PUT', success, error);
}
function deletePembayaran(id, success, error) {
	save(target + '/pembayaran/master', id, 'DELETE', success, error);
}
function loadTagihanByKode(kode, success, error) {
	load(target + '/pembayaran/perusahaan/' + getIdPerusahaan() + '/pelanggan/kode/' + kode + '/payable', success, error);
}
function loadTagihanByNama(nama, success, error) {
	load(target + '/pembayaran/perusahaan/' + getIdPerusahaan() + '/pelanggan/nama/' + nama + '/payable', success, error);
}
function loadTagihanById(id, success, error) {
	load(target + '/pembayaran/pelanggan/id/' + id + '/payable', success, error);
}
function loadPembayaranById(id, success, error) {
	load(target + '/pembayaran/id/' + id, success, error);
}
function loadListPembayaranByKodePegawai(kode, tanggalAwal, tanggalAkhir, page, success, error) {
	load(target + '/pembayaran/perusahaan/' + getIdPerusahaan() + '/pegawai/kode/' + kode + '/awal/' + tanggalAwal + '/akhir/' + tanggalAkhir + '/page/' + page, success, error);
}
function loadListPembayaranByNamaPegawai(nama, tanggalAwal, tanggalAkhir, page, success, error) {
	load(target + '/pembayaran/perusahaan/' + getIdPerusahaan() + '/pegawai/nama/' + nama + '/awal/' + tanggalAwal + '/akhir/' + tanggalAkhir + '/page/' + page, success, error);
}
function loadListPembayaranByKodePelanggan(kode, tanggalAwal, tanggalAkhir, page, success, error) {
	load(target + '/pembayaran/perusahaan/' + getIdPerusahaan() + '/pelanggan/kode/' + kode + '/awal/' + tanggalAwal + '/akhir/' + tanggalAkhir + '/page/' + page, success, error);
}
function loadListPembayaranByNamaPelanggan(nama, tanggalAwal, tanggalAkhir, page, success, error) {
	load(target + '/pembayaran/perusahaan/' + getIdPerusahaan() + '/pelanggan/nama/' + nama + '/awal/' + tanggalAwal + '/akhir/' + tanggalAkhir + '/page/' + page, success, error);
}
function loadAllKota(success, error) {
	load(target + '/alamat/kota', success, error);
}
function loadAllKecamatan(success, error) {
	load(target + '/alamat/kecamatan', success, error);
}
function loadListKecamatanByKota(kota, success, error) {
	load(target + '/alamat/kecamatan/kota/' + kota, success, error);
}
function loadAllKelurahan(success, error) {
	load(target + '/alamat/kelurahan', success, error);
}
function loadListKelurahanByKecamatan(kecamatan, success, error) {
	load(target + '/alamat/kelurahan/kecamatan/' + kecamatan, success, error);
}

//REKAP Library
function rekapAlamat(data) {
    submitPost(target + '/print/rekap/alamat', data);
}
function rekapAlamatBatch(data) {
    submitPost(target + '/print/rekap/alamat/batch', data);
}
function rekapTunggakan(data) {
    submitPost(target + '/print/rekap/tunggakan', data);
}
function kartuPelanggan(data) {
    submitPost(target + '/print/pelanggan/kartu', data);    
}
function kartuPelangganEmpty(data) {
    submitPost(target + '/print/pelanggan/kartu/empty', data);    
}
function kartuPelangganAktif(data) {
    submitPost(target + '/print/pelanggan/kartu/aktif', data);
}
function rekapHari(data) {
    submitPost(target + '/print/rekap/hari', data);    
}
function rekapBulan(data) {
    submitPost(target + '/print/rekap/bulan', data);    
}
function rekapTahun(data) {
    submitPost(target + '/print/rekap/tahun', data);    
}

//MAPS Library
var aktif_icon = 'images/aktif.png';
var berhenti_icon = 'images/berhenti.png';
var putus_icon = 'images/putus.png';
var studio_icon = 'images/studio.png';
var warning_icon = 'images/warning.png';
var unitedvision_icon = 'images/unitedvision.png';
function getIcon(status) {
	switch(status) {
		case 'aktif': return aktif_icon;
    	case 'berhenti':return berhenti_icon;
    	case 'putus': return putus_icon;
    	case 'gratis': return aktif_icon;
    }
}

var myMap;
var myMarker;
var mapIdPelanggan;
var mapped;
function getMap(map) {
    if (map == null || map == undefined) {
        var perusahaan = getPerusahaan();
        var lat = perusahaan.latitude;
        var lng = perusahaan.longitude;
        var location = new google.maps.LatLng(lat, lng);

        var mapOptions = {
            center: location,
            zoom: 16
        };

        map = new google.maps.Map($('#map-canvas')[0], mapOptions);
    }

    return map;
}
function setMarker(map, location, image, title, draggable) {
	myMarker = new google.maps.Marker({
		position: location,
        map: map,
        icon: image,
        title: title,
        draggable: draggable
	});
}
function setUnitedVisionMap(map) {
	var location = new google.maps.LatLng(1.502444, 124.915389);
	setMarker(map, location, unitedvision_icon, 'United Vision', false);
}
function setPerusahaanMap(map) {
	var perusahaan = getPerusahaan();
	var lat = perusahaan.latitude;
    var lng = perusahaan.longitude;
	if (lat != 0 && lng !=0 ) {
		var location = new google.maps.LatLng(lat, lng);
		setMarker(map, location, studio_icon, perusahaan.nama, false);
	}
}
function loadPelangganMap(status) {
    var success = function (result) {
        var myMap = getMap(myMap);
        var icon = getIcon(status.toLowerCase());

        setUnitedVisionMap(myMap);
        setPerusahaanMap(myMap);

        var list = result.listModel;
        var index;
        for (index = 0; index < list.length; index++) {
            var lat = list[index].latitude;
            var lng = list[index].longitude;

            if (lat == 0 && lng == 0)
                continue;

            var nama = list[index].nama;
            var pelanggan_location = new google.maps.LatLng(lat, lng);

            setMarker(myMap, pelanggan_location, icon, nama, false);
        }
    }

	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/status/' + status, success, errorMessage);
}
function tampilkanPeta(query, draggable) {
    var success = function (result) {
        alert(result.message);

        var model = result.model;
        var lat = model.latitude;
        var lng = model.longitude;
        mapIdPelanggan = model.id; // used in simpan method

        myMap = initializeMap(null);

        if (lat != 0 && lng != 0) {
            var icon = getIcon(model.status.toLowerCase());
            var nama = model.nama;
            var pelanggan_location = new google.maps.LatLng(lat, lng);

            setMarker(myMap, pelanggan_location, icon, nama, draggable);
            mapped = true;
        } else {
            mapped = false;
        }
    }
	
	load(target + '/pelanggan/perusahaan/' + getIdPerusahaan() + '/nama/' + query, success, errorMessage);
}
function initializeMap(map) {
    myMap = getMap(map);
    setUnitedVisionMap(myMap);
    setPerusahaanMap(myMap);
    google.maps.event.addListener(myMap, 'click', click);

    return myMap;
}

//Months definiton
var month = function () {
    return {
        getName: function (index) {
            if (index > 12)
                index -= 12;
            if (index < 1)
                index += 12;

            switch (index) {
                case 1: return 'January'
                case 2: return 'February'
                case 3: return 'March'
                case 4: return 'April'
                case 5: return 'May'
                case 6: return 'June'
                case 7: return 'July'
                case 8: return 'August'
                case 9: return 'September'
                case 10: return 'October'
                case 11: return 'November'
                case 12: return 'December'
            }
        },
        getRealName: function (name) {
			name = name.toLowerCase();
            switch (name) {
                case 'january': return 'Januari'
                case 'february': return 'Februari'
                case 'march': return 'Maret'
                case 'april': return 'April'
                case 'may': return 'Mei'
                case 'june': return 'Juni'
                case 'july': return 'Juli'
                case 'august': return 'Agustus'
                case 'september': return 'September'
                case 'october': return 'Oktober'
                case 'november': return 'November'
                case 'december': return 'Desember'
            }
        },
        getIndex: function (name) {
			name = name.toLowerCase();
            switch (name) {
                case 'january': return 1
                case 'february': return 2
                case 'march': return 3
                case 'april': return 4
                case 'may': return 5
                case 'june': return 6
                case 'july': return 7
                case 'august': return 8
                case 'september': return 9
                case 'october': return 10
                case 'november': return 11
                case 'december': return 12
            }
        }
    };
} ();
function constructPartMessage(bulan, jumlahBulan) {
    var partMessage = month.getRealName(bulan);
    var intBulan = month.getIndex(bulan);

    var i;
    for (i = 1; i < jumlahBulan; i++) {
        intBulan++;
		var nextBulan = month.getName(intBulan);
		
        partMessage += ', ' + month.getRealName(nextBulan);
    }

    return partMessage;
}
