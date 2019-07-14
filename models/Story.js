let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let StorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  allowComment: {
    type: Boolean,
    default: true
  },
  comments: [
    {
      commentBody: {
        type: String,
        required: true
      },
      commentDate: {
        type: Date,
        default: Date
      },
      commentUser: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  date: {
    type: String,
    default: Date
  }
});
module.exports = mongoose.model('stories', StorySchema, 'stories');
