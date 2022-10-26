/**
 * Created by Shaiful Islam on 2022-10-26.
 */
const electron = require('electron');
const {ipcRenderer} = electron;
//menu page
ipcRenderer.on("load-page", function(event,pageName) {
    systemCurrentPage=pageName;
    systemLoadCurrentPage();
})
ipcRenderer.on("server:connected", function(event) {
    $("#status-circle").css("color", "#FFBF00");
    ipcRenderer.send("get:ip_list");
    //request for ip address list
});
ipcRenderer.on("server:disconnected", function(event) {
    $("#status-circle").css("color", "#FF0000");
    //remove dropdown IpList
});

ipcRenderer.on("render:ip_list", function(event,ipList) {
    console.log('menu',ipList)
    let html = '<option value="0-Select machine">Select machine</option>';
    for (let k in ipList) {
        html += '<option value="'+ (k+'-'+ipList[k].machine_name) +'">' + ipList[k].ip_address + '</option>';
    }
    $("#ip_list_dropdown").html(html);
    for (let k in ipList) {
        $("#ip_list_dropdown").val(k+'-'+ipList[k].machine_name).trigger('change');//select first element or match with CM IP
        break;
    }
})
ipcRenderer.on("render:device_status", function(e, device_status_result) {
    console.log('device status')
    let device_disconneted = device_status_result['total'];
    device_disconneted = Number(device_disconneted);
    if(device_disconneted != 0) {
        jQuery("#status-circle").css("color", "#FFBF00");
        //jQuery("#status-circle").css("color", "#0000FF");
    } else {
        jQuery("#status-circle").css("color", "#32CD32");
    }
});
//menu page end
ipcRenderer.on("render:status", function(event, status_result) {
    console.log("render status called")
    console.log(status_result);
    let machine_mode = status_result['mode'];
    $("[id*=estop]").css('fill', '#fff');

    let scanner_colors = {"0" : "#f00", "1" : "#808184"};
    let device_colors = {"0" : "#f00", "1" : "#231f20"};

    // console.log(status_result);
    // let alarms_result = status_result['alarms'];
    let devices_result = status_result['devices'];
    // let estops_results = status_result['estops'];
    // //console.log(estops_results);
    //
    // jQuery("#active_alarm_tbody").empty();
    //
    for (let k in devices_result) {
        let related_device_class = "." + k;
        let related_device_status = devices_result[k];

        if($(related_device_class).length > 0) {
            let related_device_color = "#f00";

            if(k == "device-1") {
                related_device_color = scanner_colors[related_device_status];
            } else {
                related_device_color = device_colors[related_device_status];
            }

            $(related_device_class).css("fill", related_device_color);
        }
    }
    //
    // if(!jQuery.isEmptyObject(estops_results)) {
    //     //console.log("entered here");
    //     for (let k in estops_results) {
    //         let related_estop_id = "#" + estops_results[k];
    //
    //         if(jQuery(related_estop_id).length > 0) {
    //             jQuery(related_estop_id).css("fill", "#ff0");
    //         }
    //     }
    // }
    //
    // if(!jQuery.isEmptyObject(alarms_result)) {
    //     for (let k in alarms_result) {
    //         let related_alarm_gui_id = k;
    //         let related_alarm_info = alarms_result[k];
    //
    //         let alarm_type = related_alarm_info['alarm_type'],
    //             alarm_description = related_alarm_info['description'],
    //             alarm_class = related_alarm_info['alarm_class'],
    //             alarm_location = related_alarm_info['location'],
    //             variable_name = related_alarm_info['variable_name'],
    //             timestamp = related_alarm_info['timestamp'],
    //             duration = related_alarm_info['duration'];
    //
    //         timestamp = timeConverter(timestamp);
    //
    //         let tr_html = '<tr>' +
    //             '<td>' + timestamp + '</td>'+
    //             '<td>' + secondsToDhms(duration) + '</td>'+
    //             '<td>' + alarm_class_to_names[alarm_class] + '</td>'+
    //             '<td>' + alarm_location + '</td>'+
    //             '<td>' + alarm_description + '</td>'+
    //             '<td>' + variable_name + '</td>'+
    //             '</tr>';
    //
    //         jQuery("#active_alarm_tbody").append(tr_html);
    //     }
    // } else {
    //     let tr_html = '<tr><td colspan="6">No active alarm to display</td></tr>';
    //     jQuery("#active_alarm_tbody").append(tr_html);
    // }
});