const express = require('express');
const router = express.Router();
const data = require('../data');
const restaurantData = data.restaurants;
let { ObjectId } = require('mongodb');

router.get('/:id', async (req, res) => {
  try {
    if (typeof req.params.id !== 'string') throw "Id must be a string";
    if (req.params.id == '') throw "Id must be provided";
    if(!ObjectId.isValid(req.params.id)) throw "id  provided is not a valid ObjectId";
    // console.log(typeof req.params.id);
    const rest = await restaurantData.get(req.params.id);
    res.json(rest);
  } catch (e) {
    res.status(404).json({ error: 'Internal Server Error' });
    console.log(e);
  }
});


router.get('/', async (req, res) => {
  try {
    const restList = await restaurantData.getAll();
    res.json(restList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/', async (req, res) => {
  const restData = req.body;
  
 
  try {
    if (!restData.name || !restData.location || !restData.phoneNumber || !restData.website || !restData.priceRange || !restData.cuisines || !restData.serviceOptions) {
      res.status(400).json({ error: 'You must provide all the fields' });
      return;
    }
    
    restaurantData.checkNumFormat(restData.phoneNumber);
    restaurantData.checkWebFomat(restData.website);  
    restaurantData.checkPricerange(restData.priceRange);
    restaurantData.checkCuisines(restData.cuisines);
    restaurantData.checkServiceOptions(restData.serviceOptions);
    const { name, location, phoneNumber, website, priceRange, cuisines, serviceOptions } = restData;
    const newRestaurant = await restaurantData.create(name, location, phoneNumber, website, priceRange, cuisines, serviceOptions);
    res.json(newRestaurant);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});


router.put('/:id', async (req, res) => {
  
  const restData = req.body;
  try {
    if (typeof req.params.id !== 'string') throw "Id must be a string";
    if (req.params.id == '') throw "Id must be provided";
    if(!ObjectId.isValid(req.params.id)) throw "id  provided is not a valid ObjectId";
    // console.log(typeof req.params.id);
    const rest = await restaurantData.get(req.params.id);
    // res.json(rest);
  } catch (e) {
    res.status(404).json({ error: 'restaurant not found' });
    console.log(e);
    return;
  }
  try {
    if (!restData.name || !restData.location || !restData.phoneNumber || !restData.website || !restData.priceRange || !restData.cuisines || !restData.serviceOptions) {
      res.status(400).json({ error: 'You must provide all the fields' });
      return;
    }
    restaurantData.checkNumFormat(restData.phoneNumber);
    restaurantData.checkWebFomat(restData.website);  
    restaurantData.checkPricerange(restData.priceRange);
    restaurantData.checkCuisines(restData.cuisines);
    restaurantData.checkServiceOptions(restData.serviceOptions);
  } catch (e) {
    res.status(400).json({ error: e });
    console.log(e);
    return;
  }
  try {
    restData._id = req.params.id;
    const updatedRestaurant = await restaurantData.update(req.params.id,restData.name,restData.location, restData.phoneNumber, restData.website, restData.priceRange, restData.cuisines, restData.serviceOptions);
    res.json(updatedRestaurant);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete('/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(400).json({ error: 'You must Supply an ID to delete' });
    return;
  }
  try {
    if (typeof req.params.id !== 'string') throw "Id must be a string";
    if (req.params.id == '') throw "Id must be provided";
    if(!ObjectId.isValid(req.params.id)) throw "id  provided is not a valid ObjectId";
    // console.log(typeof req.params.id);
    const rest = await restaurantData.get(req.params.id);
    // res.json(rest);
  } catch (e) {
    res.status(404).json({ error: 'restaurant not found' });
    console.log(e);
    return;
  }
  try {
    const rest = await restaurantData.remove(req.params.id);
    res.json(rest);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}); 

  module.exports = router;