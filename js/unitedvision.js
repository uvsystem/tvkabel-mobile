/* UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com
 * 
 * Version: 1.1.0
 */

var target = 'https://tvk-unitedvision.whelastic.net/api';

// Please wait variable.
// This will/must be set from application's specific script.
var myApp;
// Default error callback
var errorMessage = function (jqXHR, textStatus, errorThrown) {
	alert('Error : ' + textStatus + ' - ' + errorThrown);
    //alert('Tidak bisa melakukan koneksi ke server');
}
//Error log
var errorLog = function(jqXHR, textStatus, errorThrown) {
	console.log('Error : ' + textStatus + ' - ' + errorThrown);
};
// Default callback
var emptyFunction = function () {
	//do nothing
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
	
	var success = function (result) {
	    if (result.message == 'Berhasil!') {
			setLogin(true);
	        setOperator(result.model);

	        alert('Berhasil Login - Selamat Datang ' + result.model.nama + ' dari ' + result.model.perusahaan.nama);
	        window.location.href = "index.html";
		} else {
			alert(result.message);
	    }
	};
	
	process(target + "/login.php", data, 'POST', success,	errorMessage);
}

function logout() {
	myApp.showPleaseWait();
	setLogin(false);
	resetOperator();
	myApp.hidePleaseWait();
	window.location.href = 'index.html';
	alert('Berhasil Logout');
}

function process(url, data, method, success, error) {
	var _username = getUsername();
	var _password = getPassword();
	
	if (_username != '' || password != '') {
	    var promise = $.ajax({
	        type: method,
	        url: url,
	        username: _username,
	        password: _password,
	        contentType: 'application/json',
	        processData: false,
	        data: JSON.stringify(data),
	        beforeSend: function (jqXHR, settings) {
	            myApp.showPleaseWait();
	        }
	    });
		
	    promise.done( function ( result ) {

			result = JSON.parse( result );
			
			if ( ( result.tipe == 'ERROR' ) && ( result.tipe == 'MESSAGE' ) ) {

				alert( result.message );
				
				return;
			}
			
			success( result );
		});
	    promise.fail(error);
	    promise.always(function (jqXHR, textStatus) {
	        myApp.hidePleaseWait();
	    });
	} else {
		window.location.href = 'index.html';
	}
}

function setPelangganMapLocation(id, latitude, longitude, success, error) {
	var data = {
		id: id,
		latitude: latitude,
		longitude: longitude
	};
	
	process(target + '/pelanggan/location.php', data, "PUT", success, error);
}

function loadPelangganByKode(kode, success, error) {
	var data = {
		idPerusahaan: getIdPerusahaan(),
		kode: kode
	};

	process(target + '/pelanggan/kode.php', data, "POST", success, error);
}

function loadPelangganByStatus(status, success, error) {
	var data = {
		idPerusahaan: getIdPerusahaan(),
		status: status
	};
	
	process(target + "/pelanggan/status.php", data, "POST", success, error);
};

function savePembayaran(data, success, error) {
	process(target + '/pembayaran/master.php', data, 'POST', success, error);
};

function loadTagihanById(id, success, error) {
	var data = {
		id: id
	};

	process(target + "/tagihan/id.php", data, "POST", success, error);
};

function loadTagihanByKode(kode, success, error) {
	var data = {
		idPerusahaan: getIdPerusahaan(),
		kode: kode
	};
	
	process(target + '/tagihan/kode.php', data, "POST", success,  error);
};

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

	loadPelangganByStatus(status, success, errorMessage);
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
	
	loadPelangganByKode(query, success, errorMessage);
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
