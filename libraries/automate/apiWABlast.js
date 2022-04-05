import { config } from './config.js';  // config automate
import axios from 'axios';


export default class ApiWA {
    sendWABlast = function(data, callback) {
        var dataPost = {
            "channels":[
                "wa_clare"
            ],
            "parameters":[
                {
                    "mobile_no": data['mobile_no'],
                    "kode_donasi": data['kode_donasi'],
                    "tanggal_transaksi": data['tanggal_transaksi'],
                    "nama": data['nama'],
                    "nominal": data['nominal'],
                    "program": data['program'],
                    "status_donasi": data['status_donasi']
                }
            ]
        };
        
        axios.post(config.apiUrl, dataPost, {
            headers : {  
                'Authorization' : 'Bearer ' + config.token,
                'Content-Type' : 'application/json'
            }
        }).then(function (response) {
            callback(response['data']);
        }).then((responseJson) => {
            
        }).catch(function (error) {
            console.log(error);
        });
    }

}