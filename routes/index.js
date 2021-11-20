const restaurantRoutes = require('./restaurants');
const reviewRoutes = require('./reviews');

const constructorMethod = (app) => {
  app.use('/restaurants', restaurantRoutes);
  app.use('/reviews', reviewRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;