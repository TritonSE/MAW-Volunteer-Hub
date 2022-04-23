require("dotenv").config();

module.exports = {
  app: {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || "5000",
  },
  auth: {
    // register_secret: process.env.REGISTER_SECRET || "tritonse",
    jwt_secret: process.env.JWT_SECRET || "super secret",
    cookie_secret: process.env.COOKIE_SECRET || "very very secret",
  },
  db: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/MAWDB",
  },
  amazons3: {
    bucket_name: process.env.AWS_BUCKET_NAME || "",
    bucket_region: process.env.AWS_BUCKET_REGION || "",
    access_key: process.env.AWS_ACCESS_KEY || "",
    secret_key: process.env.AWS_SECRET_KEY || "",
    max_file_size: 1.6e7, // 16 MB
  },
  maw_email: {
    user: process.env.MAW_EMAIL_USER || "",
    pass: process.env.MAW_EMAIL_PASS || "",
  },
};
