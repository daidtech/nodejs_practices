const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'editor'],
      default: 'user'
    },
    active: {
      type: Boolean,
      default: false
    },
    loginCount: {
      type: Number,
      default: 0
    },
    age: {
      type: Number,
      min: [0, 'Age must be at least 0'],
      max: [120, 'Age must be at most 120'],
      required: true,
      validate: {
        validator: function(v) {
          return Number.isInteger(v);
        },
        message: props => `${props.value} is not an integer value for age!`
      }
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', function(next) {
  console.log('Saving user:', this.name);
  console.log("Before save hook - isNew:", this.isNew);
  next();
})

userSchema.post('save', function(doc) {
  console.log('User saved:', doc.name);
  console.log("After save hook - isNew:", doc.isNew);
})

// Validate -> pre -> Save -> Post Save

module.exports = mongoose.model('User', userSchema);

// let user = await new User({name: "Reader One3", email: "reader3@example.com", passwordHash: "hashedpassword", age: 25});