const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron;
const ejse = require('ejs-electron');
const net = require("net");
const Store = require('electron-store');
const store = new Store();

let mainWindow;
//Menu section
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            { role: 'quit' }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'reload' },
            { role: 'forceReload' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },

    {
        label: 'Settings',
        submenu: [
            {
                label: 'Diagnostic Tool',
                click() {
                    console.log('Diagnostic')
                    // let linkFile = "diagonstic.ejs";
                    // mainWindow.loadFile(linkFile);
                }
            },
            {
                label: 'Settings',
                click() {
                    mainWindow.webContents.send("load-page", 'settings');
                }
            },
        ]
    },
]
let menu = Menu.buildFromTemplate(menuTemplate)
Menu.setApplicationMenu(menu)

// menuTemplate.push({
//     label: 'Logout',
//     click() {
//         console.log('logout')
//     }
// });
//
// menu = Menu.buildFromTemplate(menuTemplate);
// Menu.setApplicationMenu(menu);

const getStoredValue=(key_name)=>{
    return store.get(key_name, "not_set");
}

//Menu section End

//Client section
let client = new net.Socket();
let alreadyConnected = 0;
const reConnectTimeFactor = 1000;
let retryCount=0;

const makeConnection=()=>{
    console.log("Connecting: ",retryCount)
    if(alreadyConnected == 0) {
        let port = getStoredValue("ingram_server_port");
        let host = getStoredValue("ingram_server_address");
        if((port != "not_set") && (host != "not_set")) {
            client.connect(port, host);
        }
        else{
            console.log('Need to setup')
        }
    }
}
client.on('connect', ()=>{
    alreadyConnected = 1;
    retryCount=0;
    mainWindow.webContents.send("server:connected");
    console.log('Server Connected');
});
client.on('error', (error)=>{
    console.log('error');
    console.log(error);
});
client.on('close', (error)=>{
    //This function is called even connection failed.
    console.log('Close called');
    if(alreadyConnected){
        console.log('Disconnected from connection.');
        mainWindow.webContents.send("server:disconnected");
    }
    alreadyConnected=0;
    retryCount++;
    setTimeout(makeConnection, retryCount*reConnectTimeFactor);
});
let chunk = "";
const DELIMITER = (';#;#;');
client.on('data',(data)=>{
    let jsonData;
    let jsonObjects;
    chunk += data.toString(); // Add string on the end of the variable 'chunk'
    let d_index = chunk.indexOf(DELIMITER); // Find the delimiter

    // While loop to keep going until no delimiter can be found
    while (d_index > -1) {
        try {
            jsonData = chunk.substring(0,d_index); // Create string up until the delimiter
            jsonObjects = JSON.parse('[' + jsonData.replace(/\}\s*\{/g, '},{') + ']')
            processReceivedJsonObjects(jsonObjects); // Function that does something with the current chunk of valid json.
        }catch(er) {
            console.log("Error happened in main again");
            console.log(jsonData);
        }
        chunk = chunk.substring(d_index+DELIMITER.length); // Cuts off the processed chunk
        d_index = chunk.indexOf(DELIMITER); // Find the new delimiter
    }
});
const processReceivedJsonObjects=(jsonObjects)=>{
    console.log(jsonObjects);
    jsonObjects.forEach(function(jsonObj) {
        if(jsonObj.type != undefined) {
            let responseType = jsonObj.type;
            if(responseType == "ip_list") {
                mainWindow.webContents.send("render:ip_list", jsonObj.result);
            }
            else if(responseType == "general_view") {
                let generalViewResult = jsonObj.result;
                mainWindow.webContents.send("render:general_view", generalViewResult);
            }
            else if(responseType == "status") {
                let statusViewResult = jsonObj.result;
                mainWindow.webContents.send("render:status", statusViewResult);
            }
        }
    })
}
const sendMessageToServer=(msg)=> {
    client.write(msg);
}
//Client Section End
//Request from GUI
ipcMain.handle("getSettings", function(event) {
    let ingram_server_address = store.get('ingram_server_address', 'not_set');
    let ingram_server_port = store.get('ingram_server_port', 'not_set');
    let ingram_cm_address = store.get('ingram_cm_address', 'not_set');
    let ingram_diagnostic_url = store.get('ingram_diagnostic_url', 'not_set');
    let ingram_detailed_active_alarm = store.get('ingram_detailed_active_alarm', 'not_set');
    return{
        server_address:ingram_server_address,
        server_port:ingram_server_port,
        cm_address:ingram_cm_address,
        diagnostic_url:ingram_diagnostic_url,
        detailed_active_alarm:ingram_detailed_active_alarm
    }
});
ipcMain.on("save:settings", function(event, settings_data) {
    store.set('ingram_server_address', settings_data['server_address']);
    store.set('ingram_server_port', settings_data['server_port']);
    store.set('ingram_cm_address', settings_data['cm_address']);
    store.set('ingram_diagnostic_url', settings_data['diagnostic_url']);
    if (typeof settings_data['detailed_active_alarm'] !== 'undefined') {
        store.set('ingram_detailed_active_alarm', settings_data['detailed_active_alarm']);
    } else {
        store.set('ingram_detailed_active_alarm', 'not_set');
    }
    makeConnection();
});
ipcMain.on('get:ip_list',(event)=>{
    let m = {"req" : "send_ip_list"};
    sendMessageToServer(JSON.stringify(m));
})
ipcMain.on("get:views", (e, machineId, view_name)=> {
    if((machineId >0)) {
        let m = {"req" : view_name, "id" : machineId};
        sendMessageToServer(JSON.stringify(m));
    }
    else{
        console.log("Invalid Machine")
    }
});
///Request From GUI End
app.on('ready', function() {
    //creating new window
    mainWindow = new BrowserWindow({
        width: 1282,
        height: 1080,
        x:2000,
        y:20,
        icon:__dirname + '/theme/images/logo.png',
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
            contextIsolation: false,//need this to use node js functions in js files
        },
    });
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('theme/theme.ejs').then(()=>{
        makeConnection();
        console.log("Theme Loaded")
    })
});

