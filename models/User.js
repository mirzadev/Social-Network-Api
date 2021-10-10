const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// user schema
const UserSchema = new Schema(
      {
            username: {
                  type: String,
                  unique: true,
                  required: true,
                  trim: true
            },
            createdAt: {
                  type: Date,
                  default: Date.now,
                  get: createdAtVal => dateFormat(createdAtVal)
            },
            email: {
                  type: String,
                  unique: true,
                  required: true,
                  match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
            },
            thoughts: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'Thought'
                  }
            ],
            friends: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: 'User'
                  }
            ]
      },
      {
            toJSON: {
                  virtuals: true,
                  getters: true
            },
            // prevents virtuals from creating duplicate of _id as `id`
            id: false
      }
);


// get total count of friends
UserSchema.virtual('friendCount').get(function () {
      return this.friends.length;
});
UserSchema.virtual('thoughtCount').get(function () {
      return this.thoughts.reduce(
            (total, thought) => total + thought.reactions.length + 1,
            0
      );
});

// create the User model using the UserSchema
const User = model('User', UserSchema);

// export the User model
module.exports = User;