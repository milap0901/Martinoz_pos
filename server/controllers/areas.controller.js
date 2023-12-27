const { getDb } = require("../common/getDb");

const db2 = getDb();

const getAreas = (req, res) => {
  try {
    const areaStmt = db2.prepare(
      "SELECT id,restaurant_id,restaurant_price_id,area FROM areas"
    );

    const dineInTablesStmt = db2.prepare(
      "SELECT * FROM dine_in_tables WHERE restaurant_id= 1 AND area_id=?"
    );

    const areas = areaStmt.all([]);

    areas.forEach((area) => {
      const dineInTables = dineInTablesStmt.all([area.id]);
      area.tables = dineInTables;
    });

    res.status(200).send({
      status: false,
      message: "areas successfully ",
      data: areas,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "areas Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { getAreas };
