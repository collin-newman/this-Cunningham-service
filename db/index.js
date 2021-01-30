const mongoose = require('mongoose');

module.exports.connect = mongoose.connect('mongodb://mongo:27017/tripAdvisor', {
  useNewUrlParser: true, useUnifiedTopology: true,
})
  .then(() => console.log('Success connecting to mongo Trip Advisor'))
  .catch((err) => console.log('err connecting to mongo', err));

const showcaseSchema = new mongoose.Schema({
  attractionTitle: String,
  city: String,
  reviews: Number,
  relativeRanking: [Number, Number],
  ratio: Number,
  attractionType: String,
  overview: {
    description: String,
    isOpen: Boolean,
    // stretch goal to display all hours on click
    suggestedDuration: Number,
    address: String,
    // stretch goal to have map image link you can click on (could be fake map)
  },
  imageUrl: [String, String, String, String, String],
  travelersChoiceAward: Boolean,
  likedStatus: Boolean,
  ticketPrice: Number,
  averageRating: Number,
  // availability: Date (Stretch goal)
});

const ShowCase = mongoose.model('Showcase', showcaseSchema);

// form schema
const improveFormSchema = new mongoose.Schema({
  attractionId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  suggestedDuration: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const ImproveForm = mongoose.model('ImproveForm', improveFormSchema);

// POST form to db //
const postForm = (object, cb) => {
  const form = new ImproveForm(object);
  form.save()
    .then((data) => cb(null, data))
    .catch((err) => cb(err, null));
};

module.exports.ShowCase = ShowCase;
module.exports.postForm = postForm;
