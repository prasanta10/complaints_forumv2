const mongoose = require("mongoose")
const Complaints = require("../models/complaint")
const cities = require("./cities")
const { descriptors, places } = require("./seedHelpers")

mongoose.connect('mongodb://localhost:27017/complaints-forum-v2')
    .then(() => {
        console.log("Connected")
    })
    .catch((e) => {
        console.log(e);
    })

const sample = array => array[Math.floor(Math.random() * array.length)]


const seedData = async () => {
    await Complaints.deleteMany({})
    const data = []
    for (let i = 0; i < 35; i++) {
        const score = Math.floor(Math.random() * 50)
        const complaint = {
            location: `${sample(cities).city} ${sample(cities).state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            score,
            description: "    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque accusantium assumenda ratione optio aliquid, quasi ipsam laborum architecto in nulla facere asperiores distinctio doloribus, vero veritatis molestias maxime. Autem, voluptatibus.",
            image: [
              {
                url: 'https://res.cloudinary.com/dtme4g3zy/image/upload/v1666101565/yelpcamp/gzh4y5cefe6jmt8xpr0u.jpg',
                fileName: 'yelpcamp/gzh4y5cefe6jmt8xpr0u',
              },
              {
                url: 'https://res.cloudinary.com/dtme4g3zy/image/upload/v1666101500/yelpcamp/xnueggogtvkb5nhjncqz.webp',
                fileName: 'yelpcamp/xnueggogtvkb5nhjncqz',
              }
            ],
            user: '637b5231859290a5da5ec842'
        }
        data.push(complaint)
    }
    await Complaints.insertMany(data)
        .then(console.log("Success"));

    mongoose.connection.close()
}

seedData();