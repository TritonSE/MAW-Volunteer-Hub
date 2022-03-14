function sanitizeUser(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    admin: user.admin,
    profilePicture: user.profilePicture,
    profilePictureModified: user.profilePictureModified,
    roles: user.roles,
    joinDate: user.joinDate,
    createdAt: user.createdAt,
  };
}

module.exports = { sanitizeUser };
