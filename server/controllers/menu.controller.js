const { getDb } = require("../common/getDb");
const { getDefaultScreenData } = require("../settings/getDefaultScreenData");

const db2 = getDb();

const getMenu = (req, res) => {
  try {
    const categoryPrepare = db2.prepare(
      "SELECT id,restaurant_id,name,display_name,item_count FROM categories WHERE restaurant_id=1 AND status=1"
    );

    const itemsPrepare = db2.prepare(
      "SELECT id,category_id,name,display_name,attribute,description,is_spicy,has_jain,has_variation,order_type,price,description,has_addon,in_stock,tag,item_tax AS tax,price_type,parent_tax FROM items WHERE category_id=? AND status=1 AND restaurant_id=1 ORDER BY priority ASC"
    );

    const taxesPrepare = db2.prepare(
      "SELECT id,name,tax FROM taxes WHERE id=?"
    );

    const variationsPrepare = db2.prepare(
      "SELECT item_variation.variation_id,item_variation.restaurant_price_id as restaurantPriceId,item_variation.id as item_variation_id, item_variation.price, variations.name ,variations.display_name FROM item_variation JOIN variations ON item_variation.variation_id=variations.id WHERE item_variation.item_id=? AND item_variation.status=1 ORDER BY item_variation.priority ASC "
    );

    const addonGroupsPrepare = db2.prepare(
      "SELECT addongroups.id AS addongroup_id, addongroups.name,addongroups.display_name FROM addongroups JOIN addongroup_item_variation ON addongroup_item_variation.addongroup_id=addongroups.id WHERE addongroup_item_variation.item_variation_id=? AND addongroups.status=1 ORDER BY addongroups.priority ASC "
    );

    const addonsPrepare = db2.prepare(
      "SELECT id,attribute,addongroup_id,name,display_name,price FROM addongroupitems WHERE addongroup_id=? AND status=1 ORDER BY priority ASC"
    );

    const areaStmt = db2.prepare(
      "SELECT id,restaurant_id,restaurant_price_id,area FROM areas"
    );

    const dineInTablesStmt = db2.prepare(
      "SELECT * FROM dine_in_tables WHERE restaurant_id= 1 AND area_id=?"
    );

    const restaurantPricesStmt = db2.prepare(
      "SELECT restaurant_price_id,price FROM item_restaurant_prices WHERE item_id=?"
    );

    const areas = areaStmt.all([]);

    const areasWithTable = areas.map((area) => {
      const dineInTables = dineInTablesStmt.all([area.id]);
      return { ...area, tables: dineInTables };
    });

    const defaultSettings = getDefaultScreenData();

    const categories = categoryPrepare.all([]);

    const categoriesWithItems = categories.map((category) => {
      const items = itemsPrepare.all([category.id]);

      const itemsWithVariations = items.map((item) => {
        item.restaurantPrices = restaurantPricesStmt.all([item.id]);
        const itemTaxArray = item.tax ? item.tax.split(",") : [];

        let totalTax = 0;
        item.item_tax = itemTaxArray.map((tax) => {
          const taxData = taxesPrepare.get([+tax]);
          totalTax += taxData.tax;
          return taxData;
        });

        if (item.price_type === 1) {
          item.price = item.price / (1 + totalTax / 100);

          item.restaurantPrices = item.restaurantPrices.map(
            (restaurantPrices) => {
              return {
                ...restaurantPrices,
                price: restaurantPrices.price / (1 + totalTax / 100),
              };
            }
          );
        }

        if (item.has_variation == 1) {
          const variations = variationsPrepare.all([item.id]);

          const variationsWithAddons = variations.map((variation) => {
            const priceWithoutTaxes =
              item.price_type === 1
                ? variation.price / (1 + totalTax / 100)
                : variation.price;

            const addonGroup = addonGroupsPrepare.all([
              variation.item_variation_id,
            ]);

            const addonGroupWithAddons = addonGroup.map((group) => {
              const addons = addonsPrepare.all(group.addongroup_id);

              if (item.price_type === 1) {
                for (const addon of addons) {
                  addon.price = addon.price / (1 + totalTax / 100);
                }
              }

              return { ...group, addonItems: addons };
            });

            return {
              ...variation,
              addonGroups: addonGroupWithAddons,
              price: priceWithoutTaxes,
            };
          });

          return {
            ...item,
            variations: variationsWithAddons,
          };
        } else {
          return {
            ...item,
            variations: [],
          };
        }
      });

      return { ...category, items: itemsWithVariations };
    });

    // return { categories: categoriesWithItems, areas: areasWithTable, defaultSettings };
    const data = {
      categories: categoriesWithItems,
      areas: areasWithTable,
      defaultSettings,
    };

    res
      .status(200)
      .send({ status: true, message: "Menu Data Success", data, error: false });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "Menu Data Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { getMenu };
