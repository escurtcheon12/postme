const { sequelize } = require("../../../config/sequelize_db");
const unitConversionModels =
  require("../../models/sequelize/unit_conversion.model")(sequelize);
const { Op, QueryTypes } = require("sequelize");

let repository = {
  list: async () => {
    const rows = await unitConversionModels.findAll({
      where: {
        deletedAt: null,
      },
      order: [["createdAt", "ASC"]],
    });

    return rows;
  },
  listByProductName: async (unit_name /*, conversion = 0 */, main_conversion_status = 0) => {
    let query =
      "SELECT uc.id, uc.product_id, s.id as stock_id, p.name, p.unit_id as unit_id, u.name as unit_name, uc.conversion, uc.status FROM unit_conversions as uc INNER JOIN products as p ON uc.product_id = p.id INNER JOIN units as u ON u.id = p.unit_id INNER JOIN stocks as s ON s.product_id = p.id WHERE uc.name = ? AND uc.deletedAt IS NULL AND p.deletedAt IS NULL";

    // if (conversion) {
    //   query += " AND uc.conversion = 1";
    // }

    if (main_conversion_status) {
      query += " AND uc.status = '1'";
    }

    query += " ORDER BY uc.createdAt ASC";

    const rows = await sequelize.query(query, {
      replacements: [unit_name],
      type: QueryTypes.SELECT,
    });

    return rows;
  },
  getByProductId: async (productId) => {
    let query =
      "SELECT id, name, product_id, conversion, status FROM unit_conversions WHERE product_id = ? AND deletedAt IS NULL";

    const rows = await sequelize.query(query, {
      replacements: [productId],
      type: QueryTypes.SELECT,
    });

    return rows.length > 0 ? rows : 0;
  },
  getById: async (id) => {
    const rows = await unitConversionModels.findOne({
      where: {
        id,
      },
    });

    return rows;
  },
  getByName: async (name) => {
    const rows = await unitConversionModels.findOne({
      where: {
        name,
      },
    });

    return rows;
  },
  create: async (data) => {
    return unitConversionModels.create(data);
  },
  update: async (data, id) => {
    return unitConversionModels.update(data, {
      where: {
        id,
      },
    });
  },
  destroy: async (data, id) => {
    return unitConversionModels.destroy(data, {
      where: {
        id,
      },
    });
  },
};

module.exports = repository;
