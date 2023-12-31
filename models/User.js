const { model, Schema } = require("mongoose");

const UserSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        default: [0, 0],
      },
    },

    // relation
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    history: [{ type: Schema.Types.ObjectId, ref: "History" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    mood: { type: Schema.Types.ObjectId, ref: "Mood" },
    chats: [{ type: Schema.Types.ObjectId, ref: "PrivateChat" }],
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    notificationTokens: [{ type: String }],
    friendRequests: [{ type: Schema.Types.ObjectId, ref: "FriendRequest" }],
    meetupRequests: [{ type: Schema.Types.ObjectId, ref: "MeetUpRequest" }],
  },
  { timestamps: true }
);
UserSchema.index({ location: "2dsphere" });

module.exports = model("User", UserSchema);
