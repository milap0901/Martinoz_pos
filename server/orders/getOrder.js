const { getDb } = require("../common/getDb");
const db2 = getDb();

const getOrder = (orderId) => {
  try {
    const order = db2
      .prepare(
        "SELECT id, bill_no, biller_name, customer_name, complete_address, promo_code, promo_id, promo_discount, phone_number, order_type, dine_in_table_no, description, item_total, total_discount, discount_percent, total_tax, tax_details, delivery_charges, total, payment_type, order_status,extra_data, created_at, print_count, bill_paid FROM pos_orders WHERE id = ?"
      )
      .get([orderId]);

    const prepareItem = db2.prepare(
      "SELECT id,item_id,item_name,price,final_price, item_discount, discount_detail, quantity,variation_name,variation_id,tax_id,item_addon_items FROM pos_order_items WHERE pos_order_id = ? AND status = 1"
    );

    // const prepareToppings = db2.prepare("SELECT addongroupitem_id,name,price,quantity FROM order_item_addongroupitems WHERE order_item_id = ?");
    // const prepareTax = db2.prepare("SELECT tax_id,tax_amount FROM order_item_taxes WHERE order_item_id = ?");

    const prapareKOT = db2.prepare(
      "SELECT id,token_no FROM kot WHERE pos_order_id=?"
    );
    const parentTaxStmt = db2.prepare("SELECT child_ids FROM taxes where id=?");
    const taxesStmt = db2.prepare("SELECT * FROM taxes where id = ? ");

    const orderItems = prepareItem.all([order.id]);
    const KOTDetail = prapareKOT.all([order.id]);

    const itemsWithAddons = orderItems.map((item) => {
      const childTaxesString = item.tax_id
        ? parentTaxStmt.get(item.tax_id)
        : { child_ids: "" };

      const taxesIdArray = childTaxesString.child_ids.length
        ? childTaxesString.child_ids.split(",")
        : [];

      const taxesArray = taxesIdArray.map((tax) => {
        const taxData = taxesStmt.get(tax);
        const itemTax = {
          tax_id: taxData.id,
          tax_name: taxData.name,
          tax_percent: taxData.tax,
          tax_amount: (taxData.tax * item.final_price) / 100,
        };
        return itemTax;
      });

      // const itemAddons = prepareToppings.all([item.id]);

      // const itemTax = prepareTax.all([item.id]);\

      return {
        ...item,
        itemAddons: JSON.parse(item.item_addon_items),
        itemTax: taxesArray,
        discount_detail: JSON.parse(item.discount_detail),
      };
    });

    return {
      ...order,
      items: itemsWithAddons,
      KOTDetail,
      tax_details: JSON.parse(order.tax_details),
      extra_data: JSON.parse(order.extra_data),
      online_order_id: JSON.parse(order.extra_data).online_order_id,
    };
  } catch (err) {
    console.log(err);
  }
};

module.exports = { getOrder };

// discount_details = [
// 	{ id: "offer_id / promo_id ", type: "promo / offer / special_discount", name: "offer_name / promo_name", discount: "relavent discount amount" },
// 	{ id: "offer_id / promo_id ", type: "promo / offer / special_discount", name: "offer_name / promo_name", discount: "relavent discount amount" },
// 	{ id: "offer_id / promo_id ", type: "promo / offer / special_discount", name: "offer_name / promo_name", discount: "relavent discount amount" },
// ];
