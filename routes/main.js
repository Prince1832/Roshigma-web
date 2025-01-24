require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const slugify = require("slugify");
const slug = require("slug");
const { create } = require("xmlbuilder2");
const nodemailer = require("nodemailer");
const request = require("request");

// Model
const User = require("../models/User");
const Blog = require("../models/Blog");
const Testimonial = require("../models/Testimonial");
const CaseStudy = require("../models/CaseStudy");
const Client = require("../models/Client");
const Career = require("../models/Career");
const Team = require("../models/Team");
const Faq = require("../models/Faq");
const NewsLetter = require("../models/Newsletter");
const Category = require("../models/Category");
const Gallery = require("../models/Gallery");
const DesignPartner = require("../models/DesignPartner");
const Contact = require("../models/Contact");
const Permission = require("../models/Permission");

// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/uploads/");
  },
  filename: function (req, file, cb) {
    const originalname = path.basename(
      file.originalname,
      path.extname(file.originalname)
    );
    const filename = `${originalname}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

// const allowedimages = ["image/png", "image/jpeg", "image/jpg", "Image/webp", "image/aviff"]

// fileFilter: (req, file, cb) => {
//   if (file.mimetype in allowedimages ){
//   cb(null, true)
// }else{
//   cb(null, false)
//   return cb(new Error('Only images are allowed.'))
// }
// }

const maxSize = 3 * 1024 * 1024;
const upload = multer({ storage: storage, limits: { fileSize: maxSize } });
const single = multer().single("image");
const multiple = multer().array("images", 10);

var imageUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "logo", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Editor Media Upload

router.post("/upload-editor-media", upload.single("upload"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileUrl = `https://rhosigma.in/uploads/${req.file.filename}`;
  res.status(200).json({
    url: fileUrl,
  });
});

// Website Code

router.get("/", async (req, res) => {
  try {
    // Find the latest two blogs
    // const testimonials = await Testimonial.find().sort({ createdAt: -1 }).limit(2);
    // const latestblog = await Blog.find({ action: "Publish" }).sort({ createdAt: -1 }).limit(2);
    const caseStudies = await CaseStudy.find({ action: "Publish" }).limit(4);

    // Render the index page with the latest blogs
    res.render("index", { caseStudies });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/services", async (req, res) => {
  res.render("services");
});

router.get("/lp", async (req, res) => {
  res.render("lp");
});

router.get("/services/:slug", async (req, res) => {
  const slug = req.params.slug;

  arr = [
    "firmware-development",
    "hardware-development",
    "ai-ml",
    "hart",
    "reverse-engineering",
    "design-and-engineering",
    "testing-and-quality",
    "manufacturing-support",
    "internet-of-things",
  ];
  if (arr.includes(slug)) {
    const caseStudies = await CaseStudy.find({ action: "Publish" }).limit(4);
    res.render(slug, { caseStudies });
  } else {
    res.status(404).render("404");
  }
});

router.get("/about-us", async (req, res) => {
  try {
    const clients = await Client.find({}).limit(10);
    res.render("about-us", { clients });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/approach", async (req, res) => {
  res.render("approach");
});

router.get("/contact-us", async (req, res) => {
  res.render("contact-us");
});

router.get("/industries", async (req, res) => {
  res.render("industries");
});

router.get("/thank-you", async (req, res) => {
  res.render("thank-you");
});

router.get("/careers", async (req, res) => {
  try {
    // Find the latest two blogs
    const careers = await Career.find({});

    // Render the index page with the latest blogs
    res.render("careers", { careers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/careers/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    // Find the current blog by its slug
    const career = await Career.findOne({ slug: slug });

    if (!career) {
      return res.status(404).send("Career not found");
    }

    res.render("careers-detail", { career: career });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Career Form start
router.post("/career-form", imageUpload, async (req, res) => {
  try {
    if (!req.body.token) {
      console.log("Token is undefined");
      res.status(400).send("Captcha is undefined!");
    }
    secretKey = process.env.RECAPTCHA_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.token}`;

    request(verifyUrl, (err, response, body) => {
      if (err) {
        console.log(err);
      }

      body = JSON.parse(body);
      if (!body.success && body.success === undefined) {
        res
          .status(400)
          .send(
            "Your Captcha Verification is failed. Please, call us on +91 79776 46886"
          );
      } else if (body.score < 0.7) {
        res
          .status(400)
          .send(
            "It seems like you are a bot and if we are mistaken. Please, call us on +91 79776 46886"
          );
      }

      const { name, email, phone, position, message } = req.body;
      const transporter = nodemailer.createTransport({
        service: "SMTP",
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL,
        to: [
          "saeed.lanjekar@gmail.com",
          "abdussalam@sovorun.com",
          "lanjekarsalman1@gmail.com",
        ],
        subject: `This message is from Rhosigma Website for ${position}`,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}\nPosition: ${position}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          res
            .status(400)
            .send(
              "Due to some reason the form wasn't submitted. Please, call us on +91 79776 46886"
            );
        } else {
          console.log("Email sent successfully");
          res
            .status(200)
            .send(
              "We have received your application and will get back to you as soon as possible."
            );
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).send("Message Sent Failed. Please, Try Again!");
  }
});

router.get("/blog", async (req, res) => {
  try {
    const blogs = await Blog.find({ action: "Publish" }).populate("author");

    res.render("blog", { blogs: blogs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/blog/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    // Find the current blog by its slug
    const blog = await Blog.findOne({ slug: slug }).populate("author");

    if (!blog) {
      return res.status(404).send("Blog not found");
    }

    // Find related blogs by category (you can modify this based on your criteria)
    const relatedBlogs = await Blog.find({
      category: blog.category,
      slug: { $ne: blog.slug },
    }).populate("author");

    res.render("blog-detail", { blog: blog, relatedBlogs: relatedBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/case-studies", async (req, res) => {
  try {
    const caseStudies = await CaseStudy.find({ action: "Publish" });

    res.render("case-studies", { caseStudies });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/case-studies/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    // Find the current blog by its slug
    const caseStudy = await CaseStudy.findOne({ slug: slug });

    if (!caseStudy) {
      return res.status(404).send("Case Study not found");
    }

    // Find related case studies by category (you can modify this based on your criteria)
    const relatedCases = await CaseStudy.find({
      category: caseStudy.category,
      slug: { $ne: caseStudy.slug },
    });

    res.render("case-studies-detail", {
      caseStudy: caseStudy,
      relatedCases: relatedCases,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/design-partners", async (req, res) => {
  try {
    const design = await DesignPartner.find({});
    res.render("design-partners", { design });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/terms-of-use", async (req, res) => {
  res.render("terms-of-use");
});

router.get("/privacy-policy", async (req, res) => {
  res.render("privacy-policy");
});

//  Contacţ form
router.post("/contact-us", async (req, res) => {
  try {
    if (!req.body.token) {
      console.log("Token is undefined");
      return res.status(400).send("Captcha is undefined!");
    }

    secretKey = process.env.RECAPTCHA_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.token}`;

    request(verifyUrl, async (err, response, body) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .send(
            "Your Captcha Verification failed. Please, call us on +91 79776 46886"
          );
      }

      body = JSON.parse(body);
      if (
        !body.success ||
        body.success === undefined ||
        body.success == false
      ) {
        return res
          .status(400)
          .send(
            "Your Captcha Verification failed. Please, call us on +91 79776 46886"
          );
      } else if (body.score < 0.8) {
        return res
          .status(400)
          .send(
            "It seems like you are a bot and if we are mistaken. Please, call us on +91 79776 46886"
          );
      }

      const { name, email, phone, message, requirements } = req.body;
      try {
        await new Contact({
          name: name,
          email: email,
          phone: phone,
          requirements: requirements,
          message: message,
        }).save();
      } catch (error) {
        console.error(error);
        return res
          .status(400)
          .send(
            "It seems like there was some issue submitting the form. Please, call us on +91 79776 46886"
          );
      }

      const transporter = nodemailer.createTransport({
        service: "SMTP",
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL,
          pass: process.env.PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL,
        to: ["saeed.lanjekar@gmail.com", "abdussalam@sovorun.com"],
        subject: "This message is from Rhosigma Website",
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nRequirment: ${requirements}\nMessage: ${message}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res
            .status(400)
            .send(
              "Due to some reason the form wasn't submitted. Please, call us on +91 79776 46886"
            );
        } else {
          console.log("Email sent successfully");
          return res
            .status(200)
            .send(
              "We have received your message and will get back to you as soon as possible."
            );
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send("Message Sent Failed. Please, Try Again!");
  }
});

// NEWSLETTER
router.post("/news-letter", async (req, res) => {
  const abc = req.body.email;

  const transporter = nodemailer.createTransport({
    service: "SMTP",
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,

    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL,
    to: abc,
    subject: "Newsletter Subscription Confirmation from Rhosigma",
    text: "Thank you for subscribing to our newsletter!",
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log("NewsLetter Email sent successfully");
      res.redirect("/");
    }
  });
});
// NEWSLETTER END

// Admin Code Start

router.get("/admin", (req, res) => {
  res.redirect("/login");
});

// Register view
router.get("/register", (req, res) => {
  res.render("register", { message: null });
});

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, confirm_password } = req.body;
    if (password.length < 8) {
      res.status(500).json({
        error: "Password is too short, must be atleast of 8 characters.",
      });
    }
    if (password != confirm_password) {
      res
        .status(500)
        .json({ error: "Password & Confirm Password does not match." });
    }
    // Check if any user exists
    const count = await User.countDocuments({});
    const role = count === 0 ? "Admin" : "User";

    // Create a new user
    const user = new User({ name, email, phone, password, role });

    // Save the user to the database
    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login view
router.get("/login", (req, res) => {
  res.render("login", { message: null });
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Store user information in session
    req.session.user = {
      userId: user._id,
      role: user.role,
    };

    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/logout", (req, res) => {
  // Clear the session data
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session:", err);
    }
    // Redirect the user to the login page after logout
    res.redirect("/login");
  });
});

// Middleware to authenticate token
function checkUserRole(allowedRoles) {
  return function (req, res, next) {
    if (req.session.user && allowedRoles.includes(req.session.user.role)) {
      next();
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  };
}

function checkModelPermission(Permission) {
  return async function (req, res, next) {
    const { modelName } = req.params;
    const { user } = req.session;

    try {
      if (user.role == "Admin") {
        next();
        return;
      }
      const permission = await Permission.findOne({
        model: modelName,
        role: user.role,
      });
      if (permission && permission.operations.includes(req.method)) {
        next();
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

router.get(
  "/dashboard",
  checkUserRole(["Staff", "Admin"]),
  async (req, res) => {
    try {
      const userId = req.session.user.userId;
      const user = await User.findOne({ _id: userId });
      const allModels = mongoose.modelNames();

      res.render("dashboard", { allModels, user });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  }
);

router.get(
  "/list/:modelName",
  checkModelPermission(Permission),
  async (req, res) => {
    const modelName = req.params.modelName;
    const userId = req.session.user.userId;
    const user = await User.findOne({ _id: userId });
    const allModels = mongoose.modelNames();
    try {
      // Retrieve all the data of the specified model from the database
      const Model = mongoose.model(modelName);
      const schema = Model.schema;
      const data = await Model.find().sort({ updatedAt: -1 });

      res.render("list", { modelName, data, user, schema, allModels, Model });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

// Update form route
router.get(
  "/list/:modelName/update/:id",
  checkModelPermission(Permission),
  async (req, res) => {
    try {
      const { modelName, id } = req.params;
      const Model = mongoose.model(modelName);
      const document = await Model.findById(id);
      const userId = req.session.user.userId;
      const user = await User.findOne({ _id: userId });
      const allModels = mongoose.modelNames();
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const schema = Model.schema;

      const relatedSchemas = {}; // Store related schemas here

      // Retrieve related data
      const relatedFields = Object.values(schema.paths).filter(
        (field) => field.options.ref
      );

      for (const field of relatedFields) {
        relatedSchemas[field.options.ref] = await mongoose
          .model(field.options.ref)
          .find({});
      }

      res.render("update", {
        modelName,
        document,
        model: Model,
        mongoose,
        user,
        allModels,
        relatedSchemas,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update route
router.post(
  "/list/:modelName/update/:id",
  checkModelPermission(Permission),
  imageUpload,
  async (req, res) => {
    const modelName = req.params.modelName;
    const id = req.params.id;
    // Find the model schema based on the modelName
    const Model = mongoose.model(modelName);
    try {
      // Find the document by its ID
      const document = await Model.findById(id);

      // Update the document fields based on the request body
      for (const field in req.body) {
        document[field] = req.body[field];
      }

      if (req.files) {
        if (req.files.image && req.files.image.length > 0) {
          const oldImagePath = document.image.replace(
            "/uploads/",
            "public/uploads/"
          );
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error(`Error deleting old image: ${err}`);
          }
          document.image = `/uploads/${req.files.image[0].filename}`;
        }
        if (req.files.banner && req.files.banner.length > 0) {
          const oldImagePath = document.banner.replace(
            "/uploads/",
            "public/uploads/"
          );
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error(`Error deleting old image: ${err}`);
          }
          document.banner = `/uploads/${req.files.banner[0].filename}`;
        }
        if (req.files.logo && req.files.logo.length > 0) {
          const oldImagePath = document.logo.replace(
            "/uploads/",
            "public/uploads/"
          );
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error(`Error deleting old image: ${err}`);
          }
          document.logo = `/uploads/${req.files.logo[0].filename}`;
        }
        if (req.files.images && req.files.images.length > 0) {
          document.images.forEach((oldImageUrl) => {
            // Extract the filename from the URL
            const oldImageFilename = oldImageUrl.split("/").pop();
            // Construct the path to the old image
            const oldImagePath = `public/uploads/${oldImageFilename}`;
            try {
              fs.unlinkSync(oldImagePath);
            } catch (err) {
              console.error(`Error deleting old image: ${err}`);
            }
          });
          const imageUrls = req.files.images.map(
            (file) => `/uploads/${file.filename}`
          );
          document.images = imageUrls;
        }
      }
      // Save the updated document
      await document.save();

      res.redirect(`/list/${modelName}`);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/list/:modelName/create",
  checkModelPermission(Permission),
  async (req, res) => {
    const modelName = req.params.modelName;
    const model = mongoose.model(modelName);
    const schema = model.schema;
    const userId = req.session.user.userId;
    const user = await User.findOne({ _id: userId });
    const allModels = mongoose.modelNames();
    const relatedSchemas = {}; // Store related schemas here

    // Retrieve related data
    const relatedFields = Object.values(schema.paths).filter(
      (field) => field.options.ref
    );

    for (const field of relatedFields) {
      relatedSchemas[field.options.ref] = await mongoose
        .model(field.options.ref)
        .find({});
    }
    res.render("create", {
      modelName,
      schema,
      mongoose,
      user,
      allModels,
      relatedSchemas,
    });
  }
);

// Define the POST route for creating a document
router.post(
  "/list/:modelName/create",
  checkModelPermission(Permission),
  imageUpload,
  async (req, res) => {
    const modelName = req.params.modelName;
    const Model = mongoose.model(modelName);

    try {
      // Create a new document using the Model
      const document = new Model(req.body);

      if (req.files) {
        if (req.files.image) {
          document.image = `/uploads/${req.files.image[0].filename}`;
        }
        if (req.files.banner) {
          document.banner = `/uploads/${req.files.banner[0].filename}`;
        }
        if (req.files.logo) {
          document.logo = `/uploads/${req.files.logo[0].filename}`;
        }
        if (req.files.images) {
          const imageUrls = req.files.images.map(
            (file) => `/uploads/${file.filename}`
          );
          document.images = imageUrls;
        }
      }

      await document.save();

      res.redirect(`/list/${modelName}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while saving the document.");
    }
  }
);

// DELETE route for deleting a document by ID
router.post(
  "/list/:modelName/delete/:id",
  checkModelPermission(Permission),
  async (req, res) => {
    const modelName = req.params.modelName;
    const id = req.params.id;

    try {
      // Find the model based on the provided modelName
      const model = mongoose.model(modelName);

      // Delete the document by ID
      await model.findByIdAndDelete(id);

      res.redirect(`/list/${modelName}`);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://rhosigma.in"; // Change to your website's URL
  const urls = [
    "/about-us",
    "/contact-us",
    "/blog",
    "/careers",
    "/industries",
    "/services",
    "/services/firmware-development",
    "/services/hardware-development",
    "/services/ai-ml",
    "/services/hart",
    "/services/reverse-engineering",
    "/services/design-and-engineering",
    "/services/testing-and-quality",
    "/services/manufacturing-support",
    "/services/internet-of-things",
  ];
  const blogs = await Blog.find({ action: "Publish" }, "slug").exec();

  for (const blog of blogs) {
    const blogSlug = `/blog/${blog.slug}`;
    urls.push(blogSlug);
  }
  const caseStudies = await CaseStudy.find(
    { action: "Publish" },
    "slug"
  ).exec();

  for (const c of caseStudies) {
    const cSlug = `/case-studies/${c.slug}`;
    urls.push(cSlug);
  }

  const sitemap = create({ encoding: "UTF-8" }).ele("urlset", {
    xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
  });
  sitemap.ele("url").ele("loc").txt(baseUrl);
  for (const url of urls) {
    const pageUrl = `${baseUrl}${url}`;
    sitemap.ele("url").ele("loc").txt(pageUrl);
  }

  const sitemapXML = sitemap.end({ prettyPrint: true });

  // Save the sitemap to a file
  fs.writeFileSync("sitemap.xml", sitemapXML);

  res.set("Content-Type", "text/xml");
  res.send(sitemapXML);
});

module.exports = router;
