const express = require("express");
const {
  PermissionMiddlewareCreator,
  RecordSerializer,
} = require("forest-express-sequelize");

const models = require("../models");
const { query } = require("express");
const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator("authUser");

// This file contains the logic of every route in Forest Admin for the collection authUser:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// Create a Auth User
router.post(
  "/authUser",
  permissionMiddlewareCreator.create(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
    next();
  }
);

// Update a Auth User
router.put(
  "/authUser/:recordId",
  permissionMiddlewareCreator.update(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
    next();
  }
);

// Delete a Auth User
router.delete(
  "/authUser/:recordId",
  permissionMiddlewareCreator.delete(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
    next();
  }
);

// Get a list of Auth Users
router.get(
  "/authUser",
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
    next();
  }
);

// Get a number of Auth Users
router.get(
  "/authUser/count",
  permissionMiddlewareCreator.list(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
    // Improve peformances disabling pagination: https://docs.forestadmin.com/documentation/reference-guide/performance#disable-pagination-count
    next();
  }
);

// Get a Auth User
router.get(
  "/authUser/\\b(?!count\\b):recordId",
  permissionMiddlewareCreator.details(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
    next();
  }
);

// Export a list of Auth Users
router.get(
  "/authUser.csv",
  permissionMiddlewareCreator.export(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
    next();
  }
);

// Delete a list of Auth Users
router.delete(
  "/authUser",
  permissionMiddlewareCreator.delete(),
  (request, response, next) => {
    // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
    next();
  }
);

router.get("/authUser/:user_id/relationships/opp", (req, res, next) => {
  let limit = parseInt(req.query.page.size) || 10;
  let offset = (parseInt(req.query.page.number) - 1) * limit;
  let queryType = models.objectMapping.SELECT;

  let countQuery = `
    SELECT COUNT(*)
    FROM opp_table
    WHERE user_id = ${req.params.user_id};
  `;

  let dataQuery = `
    SELECT opp_table.*
    FROM opp_table
    WHERE user_id = ${req.params.user_id}
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  console.log(models.oppTable);
  const serializer = new RecordSerializer(models.oppTable);
  return Promise.all([
    // NOTICE:
    // Since support to multiple db connections was added you have to use the connection name defined in config/databases.js
    // here using default
    models.connections.default.query(countQuery, { type: queryType }),
    models.connections.default.query(dataQuery, { type: queryType }),
  ])
    .then(([count, queryResult]) =>
      serializer.serialize(queryResult[0], { count: count[0].count })
    )
    .then((serializedResult) => res.send(serializedResult))
    .catch((err) => next(err));
});

module.exports = router;
