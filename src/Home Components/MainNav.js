import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import styles from "./MainNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faStore,
	faBowlFood,
	faUsersViewfinder,
	faTruck,
	faCirclePause,
	faBellConcierge,
	faBell,
	faUser,
	faPowerOff,
	faPhone,
	faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { modifyCartData, resetFinalOrder } from "../Redux/finalOrderSlice";
import { useDispatch, useSelector } from "react-redux";
import ConfigSideBar from "./ConfigSideBar";
import HoldOrders from "./HoldOrders";
import { modifyUIActive } from "../Redux/UIActiveSlice";
import { useHotkeys } from "react-hotkeys-hook";
import useDeployHotkeys from "../Utils/useDeployHotkeys";
import PendingOrderLink from "./PendingOrderLink";
import { useGetMenuQuery2, useGetPrintersQuery } from "../Utils/customQueryHooks";
import { useLogoutMutation } from "../Utils/customMutationHooks";

import { executeBillPrint } from "../Utils/executePrint";
import sortPrinters from "../Utils/shortPrinters";
import useSocketPrint from "../Utils/useSocketPrint";

function MainNav() {
  // holdorder sidebar hide/show status
  const [showHoldOrders, setShowHoldOrders] = useState(false);
  // config sidebar hide/show status
  const [showConfigSideBar, setShowConfigSideBar] = useState(false);

  //mutation for logging out biller
  const { mutate: logoutMutate } = useLogoutMutation();


	const { isLoading, data: bigMenu } = useGetMenuQuery2();
	const defaultSettings = bigMenu?.defaultSettings || {};

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // custom hook to deploy shortcut keys
  useDeployHotkeys();


  //function for resetting order cart or start taking new order
  // onclick handler for "new order" button
  const getNewOrderPage = () => {

    //reset order by dispatching to finalOrder slice
    dispatch(resetFinalOrder());

    //reset activeUi slice 
    // isCartActionDisable decides can you click on items as in some case it will be disabled
    //restaurantPriceId decides area vise pricing of the items
    //activeOrderBtns decides which action btns should be showing

   
    dispatch(
      modifyUIActive({
        isCartActionDisable: false,
        restaurantPriceId: +defaultSettings?.default_restaurant_price || null,
        activeOrderBtns: ["save", "kot", "hold"],
      })
    );


    //reset finalOrder slice to defaults
    dispatch(
      modifyCartData({
        orderType: defaultSettings.default_order_type || "delivery",
        paymentMethod: defaultSettings.default_payment_type || "cash",
      })
    );

    // navigate to default landing page
    defaultSettings.default_view === "table_view"
      ? navigate("/Home/tableView")
      : navigate("/Home");
  };

  //logout biller
  //todo : handle logout
  const handleLogout = () => {
    logoutMutate({ name: null, password: null });
  };

  // deploy hotkey for new order
  useHotkeys("ctrl+n", () => getNewOrderPage());

  return (
    <>
      <Navbar bg="light" expand="lg" className={`${styles.mainNav} py-1`}>
        <Container fluid className="d-flex flex-nowrap">
          <div className="d-flex justify-content-start flex-nowrap align-items-center">
            <FontAwesomeIcon
              className={styles.bars}
              icon={faBars}
              onClick={() => setShowConfigSideBar(true)}
            />

            <Navbar.Brand className="fw-bolder text-danger fs-4 ps-1">
              Martino'z 0.3.46
            </Navbar.Brand>

            <Button
              variant="danger"
              size="sm"
              className="mx-2 py-1 px-2 fw-bold text-nowrap"
              onClick={getNewOrderPage}
            >
              New Order
            </Button>
          </div>

					<div className="d-flex flex-nowrap align-items-center">
						<Link className={`d-flex align-items-center ${styles.contact} flex-nowrap py-0 px-1 me-3 rounded-1`}>
							<FontAwesomeIcon className="mx-2" icon={faPhone} />
							<div className={`d-flex flex-column ${styles.contactText} flex-nowrap`}>
								<div className="d-flex text-nowrap my-0 py-0 me-1">call for support</div>
								<div className="d-flex text-nowrap my-0 py-0">8236855222</div>
							</div>
						</Link>

            <Link className={styles.Link} to="/serverConfig">
              <FontAwesomeIcon className={styles.LinkIcon} icon={faStore} />
            </Link>
            <Link className={styles.Link} to="/POSConfig">
              <FontAwesomeIcon className={styles.LinkIcon} icon={faBowlFood} />
            </Link>
            <Link className={styles.Link} to="LiveView/OrderView">
              <FontAwesomeIcon
                className={styles.LinkIcon}
                icon={faUsersViewfinder}
              />
            </Link>
            <PendingOrderLink />
            <Link
              className={`${styles.holdOrderLink} ${styles.Link}`}
              onClick={() => setShowHoldOrders(true)}
            >
              <FontAwesomeIcon
                className={styles.LinkIcon}
                icon={faCirclePause}
              />
              {/* {holdOrderCount !== 0 ? <div className={styles.holdOrderCountBadge}>{holdOrderCount}</div> : null} */}
            </Link>
            <Link className={styles.Link} to="tableView">
              <FontAwesomeIcon
                className={styles.LinkIcon}
                icon={faBellConcierge}
              />
            </Link>
            <Link className={styles.Link}>
              <FontAwesomeIcon className={styles.LinkIcon} icon={faBell} />
            </Link>
            <Link className={styles.Link}>
              <FontAwesomeIcon className={styles.LinkIcon} icon={faUser} />
            </Link>
            <div className={styles.Link} onClick={handleLogout}>
              <FontAwesomeIcon className={styles.LinkIcon} icon={faPowerOff} />
            </div>
          </div>
        </Container>
      </Navbar>

 
      <HoldOrders
        showHoldOrders={showHoldOrders}
        setShowHoldOrders={setShowHoldOrders}
      />


      <ConfigSideBar
        handleLogout={handleLogout}
        showConfigSideBar={showConfigSideBar}
        setShowConfigSideBar={setShowConfigSideBar}
      />
      <Outlet />
    </>
  );
}

export default React.memo(MainNav);
