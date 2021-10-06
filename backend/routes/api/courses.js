const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
const { check, validationResult, oneOf } = require('express-validator');
const multer = require("multer");

const Course = require('../../model/course.model');
const User = require('../../model/user.model');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, __dirname + '/../../public/');
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerStorage
});

router.get(
    '/',
    async (req, res) => {
      try {
        const courses = await Course.find();
        res.json(courses);
      } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message);
      }
    }
  );
  
  router.get(
    '/:id',
    async (req, res) => {
      try {
        const course = await Course.findById(req.params.id);
        if (!course) {
          return res.status(400).json({ msg: 'Course not found '});
        }
        res.json(course);
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(400).json({ msg: 'Course not found '});
        }
        res.status(500).send(err.message);
      }
    }
  );

  router.post(
    '/',
    [ auth,
      [
        check('course_name', 'Course name is required')
        .not()
        .isEmpty(),
        check('course_degree', 'Course degree must be bachelor or master')
            .isIn(['Bachelor', 'Master']),
        check('course_start_date').isISO8601().toDate(),
        check('course_end_date').isISO8601().toDate()
      ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json( { errors: errors.array() });
      }
      try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }
        if (user.user_role === "user" || user.user_role === "teacher") {
            return res.status(400).json({ errors: [{ msg: 'User not authorized' }] });
        }
  
        const new_course = new Course({
          course_name: req.body.course_name,
          course_degree: req.body.course_degree,
          course_language: req.body.course_language,
          course_year: req.body.course_year,
          course_start_date: req.body.course_start_date,
          course_end_date: req.body.course_end_date,
          course_description: req.body.course_description
        });
        const course = await new_course.save();
        res.json(course);
      } catch(err) {
        console.error(err.message);
        res.status(500).send(err.message);
      }
    }
  );

  router.post(
    '/:id',
    [ auth,
        [
            check('course_name', 'Course name is required')
            .not()
            .isEmpty(),
            check('course_degree', 'Course degree must be bachelor or master')
                .isIn(['Bachelor', 'Master']),
            check('course_start_date').isISO8601().toDate(),
            check('course_end_date').isISO8601().toDate()
        ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json( { errors: errors.array() });
      }
      try {
        const course = await Course.findById(req.params.id);
        if (!course) {
          return res.status(400).json({ msg: 'Course not found '});
        }
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }
        if (user.user_role === "user" || user.user_role === "teacher") {
            return res.status(400).json({ errors: [{ msg: 'User not authorized' }] });
        }

        const {
            course_name,
            course_degree,
            course_language,
            course_year,
            course_start_date,
            course_end_date,
            course_description
        } = req.body;
        const courseFields = {};
        if (course_name) {
            courseFields.course_name = course_name;
        }
        if (course_degree) {
            courseFields.course_degree = course_degree;
        }
        if (course_language) {
            courseFields.course_language = course_language;
        }
        if (course_year) {
            courseFields.course_year = course_year;
        }
        if (course_start_date) {
            courseFields.course_start_date = course_start_date;
        }
        if (course_end_date) {
            courseFields.course_end_date = course_end_date;
        }
        if (course_description) {
            courseFields.course_description = course_description;
        }

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: req.params.id },
            { $set: courseFields },
            { new: true }
        );
          if (!updatedCourse) {
            return res.status(400).json({ msg: 'Course not found '});
          }
          res.json(await updatedCourse.save());
        } catch(err) {
            console.error(err.message);
            res.status(500).send(err.message);
        }
    }
  );


  
  router.delete(
    '/:id',
    auth,
    async (req, res) => {
      try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }
        if (user.user_role === "user" || user.user_role === "teacher") {
            return res.status(400).json({ errors: [{ msg: 'User not authorized' }] });
        }

        const course = await Course.findById(req.params.id);
        if (!course) {
          return res.status(400).json({ msg: 'Course not found' });
        }

        await course.remove();
        res.json({ msg: "Course removed" });
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(400).json({ msg: 'Course not found' });
        }
        res.status(500).send(err.message);
      }
    }
  );

router.post(
  '/resource/:course_id',
  [auth, upload.array("file")],
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'User not found' }] });
      }
      // only teachers can upload resource
      if (user.user_role === "user") {
          return res.status(400).json({ errors: [{ msg: 'User not authorized' }] });
      }

      const course = await Course.findById(req.params.course_id);
      if (!course) {
        return res.status(400).json({ msg: 'Course not found' });
      }

      const newResource = {
        name: req.files[0].filename
      };
      if (!course.course_resources) {
        course.course_resources = [ newResource ];
      } else {
        course.course_resources.unshift(newResource);
      }
      console.log(req.files[0].path)
      console.log(__dirname)
      course.save();
      res.json({msg: "Resource uploaded"})
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Course not found' });
      }
      res.status(500).send(err.message);
    }
  }
)
  

module.exports = router;