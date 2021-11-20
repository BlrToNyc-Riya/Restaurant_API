const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const restaurants = data.restaurants;
const reviews = data.reviews;

async function main() {
    const db = await dbConnection();
    await db.dropDatabase();
    const rest1 = await restaurants.create("The Saffron Lounge", "New York City, New York", "123-456-7890", "http://www.saffronlounge.com", "$$$$", ["Cuban", "Italian"], {dineIn: true, takeOut: true, delivery: false});
    // const id1 = rest1._id;
    const rev1 = await reviews.create(rest1._id,"This place was great!","scaredycat",4,"10/29/2021","This place was great! the staff is top notch and the food was delicious!  They really know how to treat their customers");
    const rev2 = await reviews.create(rest1._id,"Expensive!!!","meow",2,"10/29/2021","Would never spend that much money for this quality of food. But Nice Ambience");
    // const id2 = rev1._id;
    const rest2 = await restaurants.create("Blue eyes", "Hoboken, New Jersey", "123-000-7890", "http://www.blueeyesrestaurant.com", "$$", ["Italian"], {dineIn: true, takeOut: true, delivery: true});
    // const id3 = rest2._id;
    const rev3 = await reviews.create(rest2._id,"Restaurant with Nice View!","nomnom",3,"10/29/2021","Great Ambience! Food was okayish!");
    // const id4 = rev1._id;
    console.log('Done seeding database');
    // const x = await reviews.get(id2);
    // console.log(x);
}
main();