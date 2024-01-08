import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import MainNav from "./Home Components/MainNav.js";
import Home from "./pages/Home";
import styles from "./Main.module.css";
import ServerConfig from "./pages/ServerConfig.js";
import LiveView from "./pages/LiveView.js";
import OrderView from "./Live View Components/OrderView.js";
import KOTView from "./Live View Components/KOTView.js";
import TableView from "./pages/TableView.js";
import Configuration from "./pages/Configuration.js";
import PrinterConfig from "./pages/PrinterConfig.js";
import PrintersList from "./pages/PrintersList.js";
import EditPrinter from "./pages/EditPrinter.js";
import PrinterAssign from "./pages/PrinterAssign.js";
import AssignBill from "./pages/AssignBill.js";
import AssignKot from "./pages/AssignKot.js";
import BillingScreenConfig from "./pages/BillingScreenConfig.js";
import EditBillingScreen from "./pages/EditBillingScreen.js";
import { setSystem } from "./Redux/serverConfigSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "react-query";
import axios from "axios";
import { modifyCartData } from "./Redux/finalOrderSlice.js";
import Loading from "./Feature Components/Loading.js";
import POSConfig from "./pages/POSConfig.js";
import { setActive } from "./Redux/UIActiveSlice.js";
import OrdersSummary from "./pages/OrdersSummary.js";
import SalesSummary from "./pages/SalesSummary.js";
import BillerLogin from "./pages/BillerLogin.js";
import { ToastContainer } from "react-toastify";
import Subscription from "./pages/Subscription.js";
import CaptionConnect from "./pages/CaptionConnect.js";

function Main() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { IPAddress, biller} = useSelector((state) => state.serverConfig);

  const getServerData = async () => {
    let data = await window.apiKey.request("getServerData", {
      JWT_SECRET:
        "29b927a793a5b4b9dbab2029984c8222ece99a3b1a5300ae988dc726071867c0",
    });
    return data;
  };

  const getServerStatus = async () => {
    const { data } = await axios.get(
      `http://${IPAddress}:3001/defaultScreenData`,
      { timeout: 10000 }
    );
    return data;
  };

  // when app starts it will try to get server data eg(systemType, IPAddress,biller) from local database via electron ipcRenderer ( getServerData call)
  // local database for client and server both stores last connected serve IP, systemType, and last biller detail in startup_config table.

  const { data: serverData, isLoading: serverDataLoading } = useQuery({
    queryKey: ["serverData"],
    queryFn: getServerData,
    onSuccess: async (data) => {
      //if sync code id not in database redirect to ./POSConfig to start new app setup
      if (!data?.sync_code) {
        navigate("./POSConfig");
        return;
      }

      // if server IPAddress is undefined redirect to ./serveConfig to start server or in case of client add server IPAdress
      if (!data?.system_type || !data?.ip) {
        navigate("./serverConfig");
        return;
      }

      // console.log("subscription", data.subscriptionStatus);

      const currentDate = new Date().getTime();

      const trialEndDate = new Date(
        data.subscriptionStatus.trial_end_date
      ).getTime();

      const licenseEndDate = new Date(
        data.subscriptionStatus.license_end_date
      ).getTime();

      if (
        !data.subscriptionStatus ||
        (trialEndDate < currentDate && licenseEndDate < currentDate)
        // (data.subscriptionStatus.is_free_trial === 0 &&
        //   data.subscriptionStatus.is_licence === 0)
      ) {
        navigate("./subscription");
        return;
      }

      // if all both IPAddress and system type is there dispatch these value in redux server_config slice for future api calls
      if (data?.ip) {
        dispatch(setSystem({ name: "IPAddress", value: data.ip }));
        dispatch(setSystem({ name: "systemType", value: data.system_type }));
        dispatch(setSystem({ name: "biller", value: data["last_login_user"] }));
        dispatch(
          setSystem({ name: "subscription", value: data.subscriptionStatus })
        );
        dispatch(modifyCartData({ biller_name: data.last_login_user }));
      }

      // if biller is logged out before closing app and last_login_user is null redirect to login page
      if (data.last_login_user === null) {
        navigate("./login");
        return;
      }
    },
    onError: () => {
      //this is for browse as browser cant make requst to system it will return error, in final build handle error by navigating to appropreate page
      // remove this in final build as it is omly for starting app in browser and handle error by redirecting to POSconfing page or serverConfig page
      dispatch(setSystem({ name: "IPAddress", value: "192.168.1.64" }));
      dispatch(setSystem({ name: "systemType", value: "client" }));
      dispatch(setSystem({ name: "biller", value: "biller" }));
      // navigate("./POSConfig");
    },
    staleTime: 5000000,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    retry: false,
  });

  //this query call get DefaultData and can only be made after IPAddress be awailaible (which will be after previos query call "serverData"), and setup default variables in redux slice
  const { data, isLoading } = useQuery({
    queryKey: ["defaultScreen"],
    queryFn: getServerStatus,
    onSuccess: async (data) => {
      dispatch(
        modifyCartData({
          orderType: data.default_order_type || "delivery",
          paymentMethod: data.default_payment_type || "cash",
        })
      );
      dispatch(
        setActive({
          key: "restaurantPriceId",
          name: +data.default_restaurant_price || null,
        })
      );

      if (!biller) {
        navigate("./login");
        return;
      }

      data.default_view === "table_view"
        ? navigate("./Home/tableView")
        : navigate("./Home");
    },
    onError: () => {
      navigate("./serverConfig");
    },
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    retry: false,
    enabled: !!IPAddress && !!biller,
  });



  // routing for the app
  return isLoading || serverDataLoading ? (
    <div className={styles.loadingContainer}>
      <Loading />
    </div>
  ) : (
    <div className={styles.main}>
      <Routes>
        <Route path="serverConfig" element={<ServerConfig />} />
        <Route path="POSConfig" element={<POSConfig />} />
        <Route path="login" element={<BillerLogin />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="Home" element={<MainNav />}>
          <Route index element={<Home />} />
          <Route path="LiveView" element={<LiveView />}>
            <Route path="OrderView" element={<OrderView />} />
            <Route path="KOTView" element={<KOTView />} />
          </Route>
          <Route path="tableView" element={<TableView />} />
          <Route path="configuration">
            <Route index element={<Configuration />} />
            <Route path="captaion" element={<CaptionConnect />} />
            <Route path="billingScreenConfig">
              <Route index element={<BillingScreenConfig />} />
              <Route path="editBillingScreen" element={<EditBillingScreen />} />
            </Route>
            <Route path="printerConfig">
              <Route index element={<PrinterConfig />} />
              <Route path="PrintersList">
                <Route index element={<PrintersList />} />
                <Route path=":printerId" element={<EditPrinter />} />
                <Route path="printerAssign/:printerId">
                  <Route index element={<PrinterAssign />} />
                  <Route path="assignKot" element={<AssignKot />} />
                  <Route path="assignBill" element={<AssignBill />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="reports">
            <Route path="ordersSummary" element={<OrdersSummary />} />
            <Route path="salesSummary" element={<SalesSummary />} />
          </Route>
        </Route>

        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default Main;
