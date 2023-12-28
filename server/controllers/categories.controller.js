const { getDb } = require("../common/getDb");

const db2 = getDb();

const getCategories = (req, res) => {
  try {
    const categoryPrepare = db2.prepare(
      "SELECT id,restaurant_id,name,display_name,item_count FROM categories WHERE restaurant_id=1 AND status=1"
    );

    const categories = categoryPrepare.all([]);

    res.status(200).json({
      status: true,
      message: "categories success",
      data: categories,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "categories Data Failed",
      data: undefined,
      error,
    });
  }
};

const getCategory = (req, res) => {
  const categoryId = req.params.id;
  // console.log(categoryId);

  try {
    const categoryPrepare = db2.prepare(
      "SELECT id,restaurant_id,name,display_name,item_count FROM categories WHERE restaurant_id=1 AND status=1 AND id=?"
    );

    const itemsPrepare = db2.prepare(
      "SELECT id,category_id,name,display_name,attribute,description,is_spicy,has_jain,has_variation,order_type,price,description,has_addon,in_stock,tag,item_tax AS tax,price_type,parent_tax FROM items WHERE category_id=? AND status=1 AND restaurant_id=1 ORDER BY priority ASC"
    );

    const category = categoryPrepare.get([categoryId]);
    const categoryItems = itemsPrepare.all([categoryId]);

    category.items = categoryItems;

    res.status(200).json({
      status: true,
      message: "category success",
      data: category,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "category Data Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { getCategories, getCategory };
