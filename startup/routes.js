
const express=require('express')
const users=require('../routes/users');
const auth=require('../routes/auth');
const orders=require('../routes/orders');
const restaurants=require('../routes/restaurants');
const subOrders=require('../routes/subOrders');
const groups=require('../routes/groups');
const error=require('../middlewares/error')



module.exports = function (app) {
  app.use(express.json());
  app.use("/public", express.static("public"));
  app.use("/api/register", users);
  app.use("/api/auth", auth);
  app.use("/api/orders", orders);
  app.use("/api/restaurants", restaurants);
  app.use("/api/suborders", subOrders);
  app.use("/api/groups", groups);
  app.use(error)
};
