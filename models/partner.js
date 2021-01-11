const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// const url = 'mongodb://localhost:27017/nucampsite';
// const connect = mongoose.connect(url, {
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true,
    }, 
}, {
    timestamps: true
});

// connect.then(() => console.log('Connected correctly to server'), err => console.log(err)).then(() => {
//     const Partner = mongoose.model('Partner', partnerSchema);
//     partner1 = new Partner({name: 'dave', image: './image', featured: true, description: 'test'});
//     partner1.save().then(console.log).catch(console.log);
// });

const Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;