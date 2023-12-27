import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";
import notify from "../Feature Components/notify";
import { resetFinalOrder } from "../Redux/finalOrderSlice";
import { modifyUIActive } from "../Redux/UIActiveSlice";
import { executeBillPrint, executeKotPrint } from "./executePrint";
import { convertOrder } from "./convertOrder";
import { printModifiedKots } from "./printModifiedKots";
import { useNavigate } from "react-router-dom";
import { setSystem } from "../Redux/serverConfigSlice";
import { renderToString } from "react-dom/server";
import Invoice from "../Reciept Prints/Invoice";

//============================================for save order and modify existing order ===================================================================//
export const useOrderMutation = (setShowKOTExistModal) => {
  const dispatch = useDispatch();
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const queryClient = useQueryClient();

  const orderRequest = async (finalOrder) => {
    const isModify = finalOrder.cartAction === "modifyOrder";
    const url = isModify
      ? `http://${IPAddress}:3001/modifyOrder`
      : `http://${IPAddress}:3001/order`;
    const { data } = await axios.post(url, { finalOrder });
    return { data, isModify }; // Include isModify in the result
  };

  return useMutation({
    mutationKey: ["order"],
    mutationFn: orderRequest,
    onSuccess: ({ data, isModify }) => {
      // Destructure isModify from the result
      if (!isModify && data.isOldKOTsExist) {
        setShowKOTExistModal(true);
        return;
      }
      const successMessage = isModify ? "order modified" : "order Placed";
      dispatch(resetFinalOrder());
      dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
      notify("success", successMessage);

      if (isModify) {
        queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["KOTs", "liveOrders"] });
      }
    },
    onError: (error) => {
      console.error(error);
      notify("err", "something went wrong");
    },
    enabled: !!IPAddress,
  });
};

// ====================================================== save and print order ==================================================================================

export const usePrintOrderMutation = (
  setShowKOTExistModal,
  setShouldPrintOrder,
  printers,
  defaultSettings
) => {
  const dispatch = useDispatch();
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const queryClient = useQueryClient();

  const printOrderRequest = async (finalOrder) => {
    const url =
      finalOrder.cartAction === "modifyOrder"
        ? `http://${IPAddress}:3001/modifyOrder`
        : `http://${IPAddress}:3001/order`;
    const { data } = await axios.post(url, { finalOrder });
    return { data, finalOrder };
  };

  return useMutation({
    mutationKey: ["printOrder"],
    mutationFn: printOrderRequest,
    onSuccess: async ({ data, finalOrder }) => {
      if (data.isOldKOTsExist && finalOrder.cartAction !== "modifyOrder") {
        setShouldPrintOrder(true);
        setShowKOTExistModal(true);
        return;
      }

      if (!data.isOldOrderExist && finalOrder.cartAction !== "modifyOrder") {
        executeKotPrint(
          {
            ...finalOrder,
            kotTokenNo: data.kotTokenNo,
            orderNo: data.orderNo,
            isModified: false,
          },
          printers,
          defaultSettings
        );
      }

      const orderToPrint = data.order;

      // const invoiceHtml = renderToString(
      //   <Invoice order={data.order} defaultSettings={defaultSettings} />
      // );

      // await window.apiKey.request("InvoicePrint", { data: invoiceHtml });

      executeBillPrint(orderToPrint, printers, defaultSettings);

      if (finalOrder.cartAction === "modifyOrder") {
        queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
        notify("success", "order modified");
      } else {
        queryClient.invalidateQueries({ queryKey: ["KOTs", "liveOrders"] });
        notify("success", "order Success");
      }
      dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
      dispatch(resetFinalOrder());
    },
    onError: (error) => {
      console.error(error);
      notify("err", "something went wrong");
    },
    enabled: !!IPAddress,
  });
};

//======================================= cancel already existing order =============================================================================================//

export const useCancelOrderMutation = (hide, setErrorMessage) => {
  const dispatch = useDispatch();
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const queryClient = useQueryClient();

  const cancelOrderRequest = async (finalOrder) => {
    const { data } = await axios.post(`http://${IPAddress}:3001/modifyOrder`, {
      finalOrder,
    });
    return data;
  };

  return useMutation({
    mutationKey: ["cancelOrder"],
    mutationFn: cancelOrderRequest,
    onSuccess: (data) => {
      // Destructure isModify from the result
      notify("success", "order Cancelled");
      dispatch(resetFinalOrder());
      dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
      hide();
      queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
    },
    onError: (error) => {
      console.error(error);
      setErrorMessage("invalid password");
      notify("err", "invalid password");
    },
    enabled: !!IPAddress,
  });
};

//============================ click save on already existing kot from cart (converting kot to order ) ================================//

export const useKotToOrderMutation = () => {
  const dispatch = useDispatch();
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const queryClient = useQueryClient();

  const kotToOrderRequest = async (finalOrder) => {
    const { data } = await axios.post(`http://${IPAddress}:3001/kotToOrder`, {
      finalOrder,
    });
    return data;
  };

  return useMutation({
    mutationKey: ["kotToOrder"],
    mutationFn: kotToOrderRequest,
    onSuccess: (data) => {
      // Destructure isModify from the result
      notify("success", "Order placed success ");
      dispatch(resetFinalOrder());
      dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
      queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
    },
    onError: (error) => {
      console.error(error);
      notify("err", "something went wrong");
    },
    enabled: !!IPAddress,
  });
};

export const useKotToPrintOrderMutation = (printers, defaultSettings) => {
  const dispatch = useDispatch();
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const queryClient = useQueryClient();

  const kotToPrintOrderRequest = async (finalOrder) => {
    const { data } = await axios.post(`http://${IPAddress}:3001/kotToOrder`, {
      finalOrder,
    });
    return { data, finalOrder };
  };

  return useMutation({
    mutationKey: ["kotToPrintOrder"],
    mutationFn: kotToPrintOrderRequest,
    onSuccess: async ({ data, finalOrder }) => {
      printModifiedKots(
        finalOrder,
        data.kotTokenNo,
        data.newKotTokenNo,
        printers
      );
      const orderToPrint = data.order;
      executeBillPrint(orderToPrint, printers, defaultSettings);
      notify("success", "Order placed success ");
      dispatch(resetFinalOrder());
      dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
      queryClient.invalidateQueries({ queryKey: ["liveOrders"] });
    },
    onError: (error) => {
      console.error(error);
      notify("err", "something went wrong");
    },
    enabled: !!IPAddress,
  });
};

//===================================================================================================================================================//

export const useKotMutation = (
  printers,
  setShowOrderExistModal,
  setShowMultipay,
  setMultipayControlType
) => {
  const dispatch = useDispatch();
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const queryClient = useQueryClient();

  const createKot = async (finalOrder) => {
    const { data } = await axios.post(
      `http://${IPAddress}:3001/KOT`,
      finalOrder
    );
    return { data, finalOrder };
  };

  return useMutation({
    mutationKey: ["createKOT"],
    mutationFn: createKot,
    onSuccess: async ({ data, finalOrder }) => {
      if (!data.orderExist) {
        finalOrder = {
          ...finalOrder,
          kotTokenNo: data.kotTokenNo,
          isModified: false,
        };

        try {
          await executeKotPrint(finalOrder, printers);
        } catch (error) {
          console.log(error);
        }

        queryClient.invalidateQueries(["KOTs"]);
        dispatch(resetFinalOrder());
        dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
        notify("success", "KOT Success");
        return;
      }
      if (data.orderExist) {
        if (finalOrder.paymentMethod === "multipay") {
          setMultipayControlType("kot");
          setShowMultipay(true);
          return;
        }
        setShowOrderExistModal(true);
        return;
      }
    },
    onError: (error) => {
      console.error(error);
      notify("err", "something went wrong");
    },
    enabled: !!IPAddress,
  });
};

//===================================================================================================================================================//

export const useModifyKotMutation = (printers) => {
  const dispatch = useDispatch();
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const queryClient = useQueryClient();

  const modifyKot = async (finalOrder) => {
    const { data } = await axios.post(`http://${IPAddress}:3001/modifyKot`, {
      finalOrder,
    });
    return { data, finalOrder };
  };

  return useMutation({
    mutationKey: ["modifyKOT"],
    mutationFn: modifyKot,
    onSuccess: async ({ data, finalOrder }) => {
      printModifiedKots(
        finalOrder,
        data.kotTokenNo,
        data.newKotTokenNo,
        printers
      );
      queryClient.invalidateQueries(["KOTs"]);
      dispatch(resetFinalOrder());
      dispatch(modifyUIActive({ activeOrderBtns: ["save", "kot", "hold"] }));
      notify("success", "KOT Success");
    },
    onError: (error) => {
      console.error(error);
      notify("err", "something went wrong");
    },
    enabled: !!IPAddress,
  });
};

//=================================================================================================================================================//

export const useUpdateOrderPrintCountMutation = () => {
  const { IPAddress } = useSelector((state) => state.serverConfig);

  const updateOrderPrintCount = async (orderId, printCount) => {
    const { data } = await axios.put(
      `http://${IPAddress}:3001/orderPrintCount`,
      { orderId, printCount }
    );
    return data;
  };

  return useMutation({
    mutationKey: ["updateOrderPrintCount"],
    mutationFn: updateOrderPrintCount,
    onSuccess: async () => {},
    onError: (error) => {
      console.error(error);
      notify("err", "something went wrong");
    },
    enabled: !!IPAddress,
  });
};

//====================================================================================================================================================//

export const usePendingOrderToOrderMutation = (printers, defaultSettings) => {
  const { IPAddress, biller } = useSelector((state) => state.serverConfig);
  const queryClient = useQueryClient();

  const pendingOrderToOrderRequest = async (pendingOrderDetail) => {
    const { data } = await axios.post(
      `http://${IPAddress}:3001/pendingOrderToOrder`,
      {
        pendingOrderDetail,
        biller: { biller_name: biller, biller_id: 1 },
      }
    );
    return data;
  };

  return useMutation({
    mutationKey: ["pendingOrderToOrder"],
    mutationFn: pendingOrderToOrderRequest,
    onSuccess: (data) => {
      // Destructure isModify from the result

      const finalOrder = data.finalOrder;
      if (finalOrder.order_status === "rejected") {
        return;
      }
      console.log("orderrrr", data.order);

      // const invoiceHtml = renderToString(
      //   <Invoice order={data.order} defaultSettings={defaultSettings} />
      // );

      // window.apiKey.request("InvoicePrint", { data: invoiceHtml });

      executeBillPrint(data.order, printers, defaultSettings);
      executeKotPrint({ ...finalOrder, isModified: false }, printers);
      queryClient.invalidateQueries(["KOTs", "liveOrders"]);
    },
    onError: (error) => {
      console.error(error);
      notify("err", "something went wrong");
    },
    enabled: !!IPAddress,
  });
};

//=======================================================================================================

export const useAuthenticateMutation = () => {
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const authenticateBillerRequest = async (billerDetail) => {
    let { data } = await axios.post(
      `http://${IPAddress}:3001/authenticateBiller`,
      { billerDetail }
    );
    data.billerDetail = billerDetail;
    return data;
  };

  return useMutation({
    mutationKey: ["authenticate"],
    mutationFn: authenticateBillerRequest,
    onSuccess: async (data) => {
      notify("success", `Welcome ${data.billerDetail.name}`);
      await window.apiKey.request("updateLoginUser", data.billerDetail);
      queryClient.invalidateQueries(["serverData"]);
      navigate("../Home");
    },
    onError: (data) => {
      console.log("fail login");
      notify("fail", "invalid credentials");
    },
    enabled: !!IPAddress,
  });
};

//======================================= logout===============================================================

export const useLogoutMutation = () => {
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutRequest = async (billerDetail) => {
    const data = await window.apiKey.request("updateLoginUser", billerDetail);
    return data;
  };

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: logoutRequest,
    onSuccess: (data) => {
      dispatch(setSystem({ name: "biller", value: null }));
      navigate("../login");
    },
    onError: (data) => {},
    enabled: !!IPAddress,
  });
};

//==========================================include kots and create new order =============================================================

export const useIncludeKotAndCreateOrderMutation = (
  finalOrder,
  hide,
  shouldPrintOrder,
  setShouldPrintOrder,
  printers,
  defaultSettings
) => {
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const dispatch = useDispatch();

  const IncludeKotAndCreateOrder = async (finalOrder) => {
    const printCount = shouldPrintOrder ? 1 : 0;
    let { data } = await axios.post(
      `http://${IPAddress}:3001/includeKOTsAndCreateOrder`,
      { ...finalOrder, printCount }
    );
    return data;
  };

  return useMutation({
    mutationKey: ["includeKOTsAndCreateOrder"],
    mutationFn: IncludeKotAndCreateOrder,
    onSuccess: (data) => {
      const { orderNo, kotTokenNo, order } = data;

      if (shouldPrintOrder) {
        try {
          const orderToPrint = order;
          executeKotPrint({ ...finalOrder, kotTokenNo }, printers);

          executeBillPrint(orderToPrint, printers, defaultSettings);
        } catch (err) {
          console.log(err);
        }
      }
      setShouldPrintOrder(false);
      hide();
      dispatch(resetFinalOrder());
      notify("success", "Orders and KOT updated");
    },
    onError: (data) => {},
    enabled: !!IPAddress,
  });
};

export const useUpdateOrderAndCreateKOTMutation = (
  printers,
  hide,
  finalOrder
) => {
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const dispatch = useDispatch();

  const handleConfirm = async (finalOrder) => {
    let { data } = await axios.post(
      `http://${IPAddress}:3001/updateOrderAndCreateKOT`,
      finalOrder
    );
    return data;
  };

  return useMutation({
    mutationKey: "updateOrderAndCreateKOT",
    mutationFn: handleConfirm,
    onSuccess: (data) => {
      hide();
      executeKotPrint({ ...finalOrder, kotTokenNo: data }, printers);
      dispatch(resetFinalOrder());
      notify("success", "Orders and KOT updated");
    },
    enabled: !!IPAddress,
  });
};
