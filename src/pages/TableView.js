import React, { useMemo } from "react";
import styles from "./TableView.module.css";
import { useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
import { useNavigate } from "react-router-dom";
import useSocket from "../Utils/useSocket";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import DineInArea from "../TableView Components/DineInArea";
import { setActive } from "../Redux/UIActiveSlice";
import {
  useGetLiveKotsQuery,
  useGetLiveOrdersQuery,
  useGetMenuQuery2,
  useGetPrintersQuery,
} from "../Utils/customQueryHooks";
import { matchOrderAndKotsWithTables } from "../Utils/matchOrderAndTables";
import Loading from "../Feature Components/Loading";
import sortPrinters from "../Utils/shortPrinters";

function TableView() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: orders,
    isLoading: isOrdersLoading,
    error,
    isError,
  } = useGetLiveOrdersQuery();
  const { data: bigMenu, isLoading: isBigMenuLoading } = useGetMenuQuery2();
  const {
    data: { data: kots },
    isLoading: isKotLoading,
  } = useGetLiveKotsQuery();
  const { data: printerArr, isLoading: isPrintersLoading } =
    useGetPrintersQuery();
  const printers = useMemo(
    () => (printerArr?.length ? sortPrinters(printerArr) : []),
    [printerArr]
  );

  const areas = bigMenu?.areas || [];
  const defaultSettings = bigMenu?.defaultSettings || {};
  const defaultRestaurantPrice = defaultSettings.default_restaurant_price || 0;

  // const defaultRestaurantPrice = defaultSettings?.default_restaurant_price || 0 ;

  useSocket("orders", (data) => {
    queryClient.setQueryData("liveOrders", (oldData) => ({ ...oldData, data }));
  });

  useSocket("KOTs", (data) => {
    queryClient.setQueryData("KOTs", (oldData) => ({ ...oldData, data }));
  });

  const handleClick = (orderType) => {
    dispatch(resetFinalOrder());
    dispatch(modifyCartData({ orderType }));
    dispatch(
      setActive({
        key: "restaurantPriceId",
        name: +defaultRestaurantPrice || null,
      })
    );
    navigate(`..${orderType === "dine_in" ? "?openTable=true" : ""}`);
  };
  const allAreas = useMemo(
    () => matchOrderAndKotsWithTables(orders?.data, areas, kots),
    [areas, orders?.data, kots]
  );

  if (
    isOrdersLoading ||
    isBigMenuLoading ||
    isKotLoading ||
    isPrintersLoading
  ) {
    return <Loading />;
  }

  return (
    <div className={styles.tableView}>
      <header>
        <div className={styles.heading}> Table View</div>
        <div className={styles.control}>
          <button onClick={() => handleClick("delivery")}> Delivery </button>
          <button onClick={() => handleClick("pick_up")}> Pick Up</button>
          <button onClick={() => handleClick("dine_in")}>+ Add Table</button>
        </div>
      </header>
      <div className={styles.legendClass}>
        <div className={styles.indicator}>
          <div
            className={styles.circle}
            style={{ backgroundColor: "rgba(3, 148, 3, 0.247)" }}
          ></div>
          <div>Runnig Table</div>
          <div
            className={styles.circle}
            style={{ backgroundColor: "rgba(160, 77, 0, 0.329)" }}
          ></div>
          <div>Runnig KOT Table</div>
          <div
            className={styles.circle}
            style={{ backgroundColor: " rgba(0, 72, 167, 0.3)" }}
          ></div>
          <div>Printed Table</div>
        </div>
      </div>

      <main className={styles.tableList}>
        {isOrdersLoading && <div>Loading....</div>}
        {isError && <div>{error}</div>}

        {allAreas?.map((area) => {
          if (area.tables.length) {
            return (
              <DineInArea
                area={area}
                key={area.id}
                defaultSettings={defaultSettings}
                restaurantPriceId={area.restaurant_price_id}
                printers={printers}
              />
            );
          } else {
            return null;
          }
        })}
      </main>
    </div>
  );
}

export default TableView;
