import { configureStore } from "@reduxjs/toolkit";
import currentItemReducer from "./currentItemSlice";
import finaOrderReducer from "./finalOrderSlice";
import menuItemsReducer from "./menuItemsSlice";
import bigMenuReducer from "./bigMenuSlice";
import serveConfigReducer from "./serverConfigSlice";
import UIActiveReducer from "./UIActiveSlice";
import KOTReducer from "./KOTSlice";
import printerSettingsReducer from "./printerSettingsSlice";

const store = configureStore({
      middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                  immutableCheck: { warnAfter: 50 },
                  serializableCheck: { warnAfter: 50 },
            }),
      reducer: {
            currentItem: currentItemReducer,
            finalOrder: finaOrderReducer,
            menuItems: menuItemsReducer,
            bigMenu: bigMenuReducer,
            serverConfig: serveConfigReducer,
            UIActive: UIActiveReducer,
            KOTs: KOTReducer,
            printerSettings: printerSettingsReducer,
      },
});

export default store;


