import React, { useState } from "react";
import styles from "./EditBillingScreen.module.css";
import { motion } from "framer-motion";
import BackButton from "../Feature Components/BackButton";
import { useNavigate } from "react-router-dom";
import DefaultDisplayOptions from "../Edit Billing screen Components/DefaultDisplayOptions";
import DefaultOrderCalculation from "../Edit Billing screen Components/DefaultOrderCalculation";
import { useMutation, useQuery, useQueryClient } from "react-query";
import notify from "../Feature Components/notify";
import Loading from "../Feature Components/Loading";
import { useSelector } from "react-redux";
import axios from "axios";

function EditBillingScreen() {
	const { IPAddress } = useSelector(state => state.serverConfig);
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [defaultOptions, setDefaultOptions] = useState({
		default_view: "billing",
		order_view_sort: "asc",
		kot_view_sort: "asc",
		default_order_type: "dine_in",
		default_payment_type: "cash",
		default_round_off_options: "normal",
		default_invoice_decimal: 2,
		default_price_type: "with_tax",
		default_restaurant_price: 0,
		invoice_f_m: "",
		invoice_display_token_no: 1,
		customer_phone_mandatory: "1,2,3",
	});

	const getDefaultScreenData = async () => {
		const { data } = await axios.get(`http://${IPAddress}:3001/defaultScreenData`);
		return data;
	};

	const { data, isLoading, isError, isFetching } = useQuery({
		queryKey: "defaultScreenData",
		queryFn: getDefaultScreenData,
		refetchOnWindowFocus: false,
		onSuccess: data => {
			setDefaultOptions(prev => ({
				...prev,
				default_view: data.default_view,
				order_view_sort: data.order_view_sort,
				kot_view_sort: data.kot_view_sort,
				default_order_type: data.default_order_type,
				default_payment_type: data.default_payment_type,
				default_round_off_options: data.default_round_off_options,
				default_invoice_decimal: data.default_invoice_decimal,
				default_price_type: data.default_price_type,
				default_restaurant_price: data.default_restaurant_price,
				invoice_f_m: data.invoice_f_m,
				invoice_display_token_no: data.invoice_display_token_no,
				customer_phone_mandatory: data.customer_phone_mandatory,
			}));
		},
	});

	const updateDefaultScreenData = async options => {
		const { data } = await axios.patch(`http://${IPAddress}:3001/defaultScreenData`, options);
		return data;
	};

	const {
		mutate,
		isLoading: mutationLoading,
		isFetching: mutationFetching,
	} = useMutation({
		mutationKey: "defaultScreenData",
		mutationFn: updateDefaultScreenData,
		onSuccess: () => {
			notify("success", "Default Screen Data updated");

			queryClient.invalidateQueries({ queryKey: ["bigMenu"] });
			queryClient.invalidateQueries({queryKey : ["defaultScreen"]});
		
			navigate("..");
		},
	});
		
	const handleSave = options => {
		mutate(options);
	};

	return (
		<motion.div
			className={styles.ConfigurationBody}
			initial={{ opacity: 0, scale: 0.98 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.1 }}>
			<header className={styles.configHeader}>
				<div className={styles.configInfo}>
					<div>Edit Billing Screen</div>
				</div>
				<BackButton onClick={() => navigate("..")} />
			</header>
			{isFetching || mutationFetching || mutationLoading ? (
				<div className={styles.loadingContainer}>
					<Loading />
				</div>
			) : null}

			{!isFetching && !mutationFetching && !mutationLoading ? (
				<main className={styles.billingScreenOptions}>
					<DefaultDisplayOptions defaultOptions={defaultOptions} setDefaultOptions={setDefaultOptions} />
					<DefaultOrderCalculation defaultOptions={defaultOptions} setDefaultOptions={setDefaultOptions} />
				</main>
			) : null}
			<div className={styles.billingScreenControl}>
				<button className={styles.saveBtn} onClick={() => handleSave(defaultOptions)}>
					Save
				</button>
				<button className={styles.cancelBtn} onClick={() => navigate("..")}>
					Cancel
				</button>
			</div>
		</motion.div>
	);
}

export default EditBillingScreen;
