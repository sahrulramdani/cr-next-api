// -----  MANIPULATION STRING -------------

// Collection (Set) to String (union with semicolon)
const fncUnionComma = (varArray) => {
    var output = "";
    var arrayLength = varArray.size;
    if (arrayLength > 0) {
        var i = 0;
        for (let item of varArray) {
            if (i === 0) {
              output += item;
            } else {
              output += ';' + item;
            }

            i++;
        }
    }
    
    return output;
};

// String (union semicolon) to Array
function fncParseComma(paramInput) {
    var output = [];
    var temp = [];
    temp = paramInput.split(';');

    if (temp.length > 0) {
        output = temp;
    }

    return output;
}

// -----  MANIPULATION DATE -------------
function ExcelDateToJSDate(serial) {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }

 function weekOfMonth(tgl) {
    // Jika param tgl bukan Object Date, maka menggunakan tanggal sekarang
    // output : Week 1 s.d. Week 4/5

   if (!(tgl instanceof Date)) {
       var tgl2 = new Date();

       var date = tgl2.getDate();
       var day = tgl2.getDay();
   
       var output = (Math.abs(Math.ceil((date - 1 - day) / 7))) + 1;

       return output;
   } else {
       var date = tgl.getDate();
       var day = tgl.getDay();
   
       var output = (Math.abs(Math.ceil((date - 1 - day) / 7))) + 1;

       return output;
   }
}

// -----  MANIPULATION NUMBER -------------
function separatorNumber(angka) {
    // separator ','   descimal '.'

    if (angka === null) {
        angka = 0;
    }

    angka = angka.toString().replaceAll(',', '');

    if (angka.length>3) {
        var temp = angka.split('.');
        var bilangan = temp[0];
        bilangan = bilangan.replace(/[^0-9]/g,"");   // bersihkan selain angka

        var ok = '';
        var i = -2;
        for (var j=bilangan.length; j>=0; j--) {
            i = i + 1;
            var separator = ''
            
            separator = i == 3 ?  ',' : '';
            
            i = i == 3 ? 0 : i;
            ok = bilangan.substring(j, j+1) + separator + ok; 
        }

        angka = ok;

        if (temp.length > 1) {
            angka = angka + '.' + temp[1].replace(/[^0-9]/g,"");
        }
    }

    return angka;
}

// ------------- Function Logical --------------
const fncAnd = (arg1, arg2) => {
    if (arg1 === '1' && arg2 === '1') {
        return '1';
    } else if (arg1 === '1' && arg2 === '0') {
        return '0';
    } else if (arg1 === '0' && arg2 === '1') {
        return '0';
    } else {
        return '0';
    }
}

// ------------- Sisqu Utilities --------------
const generateAutonumber = (initial, sequenceUnitCode, tahun, nextSequenceFormat) => {
    var output = initial + sequenceUnitCode + tahun.toString().substring(2) + nextSequenceFormat;
    
    return output;
}


export { 
    fncUnionComma, fncParseComma, ExcelDateToJSDate, 
    generateAutonumber, weekOfMonth, separatorNumber,
    fncAnd
};