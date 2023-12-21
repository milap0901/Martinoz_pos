import notify from "../Feature Components/notify";

export const validateOrder = (finalOrder, setSearchParams, customerPhoneMandatory ) => {
	if (finalOrder.orderType === "dine_in" && finalOrder.tableNumber === "") {
		notify("err", "please Enter Table No.");
		setSearchParams(prev => ({ openTable: "true" }));
		return false;
	}

	if (customerPhoneMandatory.includes(finalOrder.orderType) && !finalOrder.customerContact) {
		notify("err", "please enter contact");
		setSearchParams(prev => ({ openCustomerDetail: "true" }));
		return false;
	}

    if (finalOrder.orderCart.filter(item => item.itemStatus !== "removed").length === 0){
        notify("err", "Cart is Empty");
        return false
    }


    return true
};

