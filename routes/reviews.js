const express = require('express');
const router = express.Router();
const data = require('../data');
const reviewData = data.reviews;
let { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const restaurants = mongoCollections.restaurants;

router.get('/:id', async (req, res) => {
   
  try {
    if (typeof req.params.id !== 'string') throw "Id must be a string";
    if (req.params.id == '') throw "Id must be provided";
    if(!ObjectId.isValid(req.params.id)) throw "resturantId is not a valid ObjectId";
    const rest = await reviewData.getAll(req.params.id);
    res.json(rest);
  } catch (e) {
    res.status(404).json({ error: e });
    console.log(e);
  }
});

router.post('/:id', async (req, res) => {
  const revData = req.body;
  try {
    if (!revData.title || !revData.reviewer || typeof revData.rating === undefined || !revData.dateOfReview || !revData.review ) {
      res.status(400).json({ error: 'You must provide all the fields' });
      return;
    }
    if(!(typeof req.params.id === 'string') ||  !(typeof revData.title === 'string') || !(typeof revData.reviewer === 'string') ||  !(typeof revData.dateOfReview === 'string') || !(typeof revData.review === "string") )
        throw "name, location, phoneNumber, website, priceRange should be of type string";
    if(req.params.id === ''|| revData.title === '' ||  revData.reviewer === '' ||  revData.dateOfReview === ''||  revData.review === '' )
        throw "name, location, phoneNumber, website, priceRange should not be an empty string";  

    if(!ObjectId.isValid(req.params.id)) throw "resturantId is not a valid ObjectId";
    const restaurantCollection = await restaurants();
    let parsedId = ObjectId(req.params.id);
    const restnt = await restaurantCollection.findOne({ _id: parsedId });
    if (restnt === null) throw 'No restaurant with that id';
    reviewData.checkRating(revData.rating);
    reviewData.checkDate(revData.dateOfReview);

  } catch (e) {
    res.status(400).json({ error: e });
    return;
  }

  try {
    revData._id = req.params.id;
    const updatedRestaurant = await reviewData.create(req.params.id,revData.title,revData.reviewer, revData.rating, revData.dateOfReview, revData.review);
    res.json(updatedRestaurant);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
router.get('/review/:id', async (req, res) => {
 
try {
  if (typeof req.params.id !== 'string') throw "Id must be a string";
  if (req.params.id == '') throw "Id must be provided";
  if(!ObjectId.isValid(req.params.id)) throw "resturantId is not a valid ObjectId";
  const rest = await reviewData.get(req.params.id);
  res.json(rest);
} catch (e) {
  res.status(404).json({ error: e });
  console.log(e);
}
});
// router.get('/', async (req, res) => {
//   try {
//     const reviewList = await reviewData.getAll();
//     res.json(reviewList);
//   } catch (e) {
//     res.status(500).json({ error: e });
//   }
// });

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
    // const rest = await reviewData.get(req.params.id);
    // res.json(rest);
  } catch (e) {
    res.status(404).json({ error: e });
    console.log(e);
    return;
  }
  try {
    const rest = await reviewData.remove(req.params.id);
    res.json(rest);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}); 

module.exports = router;