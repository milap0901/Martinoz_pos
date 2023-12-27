const { getDb } = require("../common/getDb");

const db2 = getDb();

const getCustomers = (req, res) => {
  const params = req.query;
  console.log(params);

  try {
    let matches;

    if (params.customerContact) {
      matches = db2
        .prepare(
          `SELECT id, name, number FROM customers WHERE number LIKE $number || '%' ORDER BY CASE WHEN number = $number THEN 0 WHEN number LIKE $number || '%' THEN 1 ELSE 2 END LIMIT 15`
        )
        .all({
          number: params.customerContact,
        });
    } else {
      matches = db2
        .prepare(
          `SELECT id, name, number FROM customers WHERE name LIKE $name || '%' ORDER BY CASE WHEN name = $name THEN 0 WHEN name LIKE $name || '%' THEN 1 ELSE 2 END LIMIT 15`
        )
        .all({
          name: params.customerName,
        });
      // matches = await dbAll(db, `SELECT id,name,number FROM users WHERE name LIKE "${params.customerName}%" LIMIT 10`, []);
    }

    for (const match of matches) {
      match.addresses = db2
        .prepare(
          "SELECT complete_address,landmark FROM customer_addresses WHERE customer_id=?"
        )
        .all(match.id);
    }
    // return matches;

    // console.log(matches);
    res.status(200).send({
      status: true,
      message: "customers successfully ",
      data: matches,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: false,
      message: "customers Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { getCustomers };
