const mongoose = require('mongoose');
const Surfpoint = require('../models/surfpoint');
const {descriptors,places} = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://127.0.0.1:27017/surf-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})
.then(() => {
  console.log('MongoDBコネクションOK');
})
.catch((err) => {
  console.log('MongoDBコネクションError', err);
});

const sample = array => array [Math.floor(Math.random()*array.length)];

const seedDB = async () =>{

    await Surfpoint.deleteMany({});
    for(let i=0; i<50; i++){
        const randomCityIndex = Math.floor(Math.random()*cities.length);
        const price = Math.floor(Math.random() * 2000)+1000;
        const point = new Surfpoint({

          author:"65d911137eade24ab4d4ca7d",
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title:`${sample(descriptors)}・${sample(places)}`,
            description: '私も時間さぞ漠然たるふり方という事のところに云っないあり。なお結果に失敗院は一々その衰弱ございないくらいをしばいですには努力しよですでて、またにはなっなあるたで。考にした方は何しろ将来のことにありましたい。もっとも向さんに腐敗自己あまり誘惑でなるな傍点この実何か附着にというおごろごろですなかろたないて、この当時もこれかモーニング状態に出るけれども、大森さんのはずが人の私をまるでご発展と考えばそれ主人がお承諾に来ように多分お演説が立ったたから、人知れず無論参考に思いないじゃなりないものにするですない。',
            geometry:{
              type:'Point',
              coordinates:[
                cities[randomCityIndex].longitude,
                cities[randomCityIndex].latitude
              ]

            },

            price:price,
            images:[
              {
                url: 'https://res.cloudinary.com/dh2uxvqfa/image/upload/v1709362347/YelpSurf/is7lr0j5yjvgwgaaywff.jpg',
                filename: 'YelpSurf/is7lr0j5yjvgwgaaywff'
              },
            ],
        });
        await point.save();

    }

}

seedDB().then(()=>{
    mongoose.connection.close();
});
