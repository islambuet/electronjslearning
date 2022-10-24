const electron = require('electron');
const {app, BrowserWindow, Menu, ipcMain} = electron;
const ejse = require('ejs-electron');

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
                    console.log('Settings')
                    //if(logged_in_user_role === 1) {
                    // let linkFile = "settings-page.ejs";
                    // mainWindow.loadFile(linkFile, {query: {"role": logged_in_user_role}});
                    // } else {
                    // 	let linkFile = "login.ejs";
                    // 	mainWindow.loadFile(linkFile);
                    // }
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

//menu section
console.log(__dirname)
app.on('ready', function() {
    //creating new window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1080,
        icon:__dirname + '/pages/theme/images/logo.png',
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
            contextIsolation: false,//need this to use node js functions in js files
        },
    });
    mainWindow.webContents.openDevTools()
    mainWindow.loadFile('pages/theme.ejs');
});
