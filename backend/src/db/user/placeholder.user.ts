import { User } from "db/user/user.schema";

/**
 * For displaying a dummy user on a post of a deleted user
 */
const placeholderUser: User = {
  id: "DELETED",
  username: "Deleted user",
  displayName: "Deleted user",
  createdAt: new Date(),
  profilePicture: "default.png",
  role: "user",
  active: false,
  bio: null,
  website: null,
  location: null,
  birthDate: null,
};

export default placeholderUser;
