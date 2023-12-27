const { fork } = require("child_process");
const {
  app,
  BrowserWindow,
  protocol,
  ipcMain,
  Menu,
  Notification,
  globalShortcut,
} = require("electron");
const path = require("path");
const url = require("url");
const { autoUpdater } = require("electron-updater");
const { default: axios } = require("axios");
const os = require("os");
const { setMenuData } = require("./electronUtils/setMenuData");
const { printKot } = require("./electronUtils/printKot");
const { printInvoice } = require("./electronUtils/printInvoice");
const { setupMainDatabase } = require("./electronUtils/setupMainDatabse");
const { getLocalDb } = require("./electronUtils/getLocalDb");
const {
  updateDatabaseSchema,
} = require("./electronUtils/updateDatabaseSchema");
const { getServerData } = require("./electronUtils/getServerData");
const {
  getLandingPage,
  initiateServer,
} = require("./electronUtils/initiateApp");
const { InvoicePrint } = require("./electronUtils/InvoicePrint");

const destinationFolder = app.isPackaged
  ? path.join(app.getAppPath(), "..", "..", "..", "..", "pos_db")
  : path.join(app.getAppPath(), "..", "..", "pos_db");
const sourceFile = app.isPackaged
  ? path.join(app.getAppPath(), "..", "..", "posDatabse.sqlite")
  : path.join(app.getAppPath(), "posDatabse.sqlite");
const destinationFile = app.isPackaged
  ? path.join(destinationFolder, "posDatabse.sqlite")
  : path.join(destinationFolder, "posDatabse.sqlite");
const serverFilePath = path.join(app.getAppPath(), "server", "server");
let db2 = getLocalDb(destinationFile);
let mainWindow;
let serverProcess;
const latestDbVersion = 4;

// Create the native browser window.

// Menu.setApplicationMenu(null);
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  globalShortcut.register("CommandOrControl+Shift+i", () => {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  });

  globalShortcut.register("CommandOrControl+r", () => {
    mainWindow.webContents.reload();
  });

  const startupConfig = getServerData(db2);

  serverProcess = initiateServer(
    startupConfig,
    serverFilePath,
    destinationFile
  );

  // landingPage = getLandingPage(startupConfig);

  // console.log(landingPage);

  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : `http://localhost:3006/#/home`;

  console.log(appURL);

  if (startupConfig?.system_type === "server") {
    serverProcess?.on("message", (message) => {
      if (message.status === "started") {
        mainWindow.loadURL(appURL);
      }
    });
  } else {
    mainWindow.loadURL(appURL);
  }
}

app.on("ready", function () {
  updateDatabaseSchema(latestDbVersion, db2);

  if (!app.isPackaged) {
    const {
      default: installExtension,
      REDUX_DEVTOOLS,
    } = require("electron-devtools-installer");

    installExtension(REDUX_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }
  if (app.isPackaged) {
    // autoUpdater.setFeedURL({
    // 	requestHeaders: {},
    // 	provider: "github",
    // 	owner: "pratiks1994",
    // 	repo: "pos-update",
    // 	token:"" ,
    // });
    autoUpdater.disableWebInstaller = true;
    autoUpdater.checkForUpdatesAndNotify();
  }
});

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
});

autoUpdater.on("update-available", (info) => {
  console.log("Update available.");
});

autoUpdater.on("update-not-available", (info) => {
  console.log("Update not available.");
});

autoUpdater.on("error", (err) => {
  console.log("Error in auto-updater. " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message =
    log_message +
    " (" +
    progressObj.transferred +
    "/" +
    progressObj.total +
    ")";
  console.log(log_message);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("Update downloaded");
});

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol("file", (request) => {
    console.log(request);
    const url = request.url.substr(8);
    return { path: path.normalize(`${__dirname}/${url}`) };
  });
}

app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (serverProcess) {
    serverProcess.send({ command: "shutdown" });
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

ipcMain.handle("setup", async (event, payload) => {
  try {
    const res = await axios.get("http://localhost:3001/ping", {
      timeout: 1000,
    });
  } catch (err) {
    serverProcess = fork(path.join(app.getAppPath(), "server", "server"), [
      destinationFile,
    ]);
    return { status: "started" };
  }
});

ipcMain.handle("updateLoginUser", async (event, payload) => {
  const { name } = payload;
  console.log(name);
  try {
    db2.transaction(() => {
      db2
        .prepare(
          "UPDATE startup_config SET value = ? WHERE name='last_login_user'"
        )
        .run([name]);
    })();
    return { sucess: "true", status: 200, error: null };
  } catch (error) {
    console.log(error);
    return { sucess: "false", status: 404, error: null };
  }
});

ipcMain.handle("getConnectedPrinters", async (event, payload) => {
  const connectedPrinters = await mainWindow.webContents.getPrintersAsync();
  return connectedPrinters;
});

ipcMain.handle("newOnlineOrder", async (event, payload) => {
  const { customerNames } = payload;

  const messageBody =
    customerNames.length === 1
      ? `There is new order from ${customerNames[0]}`
      : `There are ${customerNames.length} new orders `;
  const notification = new Notification({
    title: "POS",
    subtitle: "New Order",
    body: messageBody,
  });

  notification.on("click", () => {
    mainWindow.show();
  });
  notification.show();
});

ipcMain.handle("storeServerData", async (event, payload) => {
  const { IPAddress, systemType } = payload;
  try {
    db2
      .prepare("UPDATE startup_config SET value=? WHERE name='ip'")
      .run(IPAddress);
    db2
      .prepare("UPDATE startup_config SET value=? WHERE name='system_type'")
      .run(systemType);
  } catch (error) {
    return error;
  }
});

ipcMain.handle("getServerData", async (event, payload) => {
  // const networkInterfaces = os.networkInterfaces();
  // const ipAddress = networkInterfaces["Ethernet"][1].address;
  const serverData = getServerData(db2, payload.JWT_SECRET);
  return serverData;
});

ipcMain.handle("syncDatabase", async (event, payload) => {
  await setupMainDatabase(destinationFolder, sourceFile, destinationFile);
  db2 = getLocalDb(destinationFile);
  const responce = await setMenuData(
    payload.token,
    payload.syncCode,
    payload.JWT_SECRET,
    db2
  );
  return responce;
});

ipcMain.handle("kotPrint", async (event, payload) => {
  try {
    await printKot(payload);
  } catch (error) {
    console.log(err);
    return err;
  }
});

ipcMain.handle("InvoicePrint", async (event, payload) => {
  try {
    await InvoicePrint(payload);
  } catch (error) {
    console.log(err);
    return err;
  }
});

// ipcMain.handle("printInvoice", async (event, payload) => {
//   try {
//     printInvoice(payload);
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// });
