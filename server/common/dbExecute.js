const dbAll = async (db, qry, valuesArray) => {
      const data = await new Promise((res, rej) => {
            try {
                  db.all(qry, valuesArray, (err, row) => {
                        if (err) {
                              rej(err);
                        } else {
                              res(row);
                        }
                  });
            } catch (err) {
                  rej(err);
            }
      });

      return Promise.all(await data);
};

const dbRun = async (db, qry, valuesArray) => {
      const data = await new Promise((res, rej) => {
            try {
                  db.run(qry, valuesArray, function (err) {
                        if (err) {
                              rej(err);
                        } else {
                              res(this.lastID);
                        }
                  });
            } catch (err) {
                  rej(err);
            }
      });

      return await data;
};

module.exports = { dbAll, dbRun };
