var mongoose= require('mongoose')

var googleUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true
  },
  displayName: {
    type: String
  }
})

var GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

module.exports = GoogleUser;
