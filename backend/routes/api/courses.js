const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, oneOf } = require('express-validator');
const multer = require("multer");
const extract = require('metadata-extract');
const { spawn } = require('child_process');

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
          check('course_faculty', 'Course faculty is required')
          .not()
          .isEmpty(),
          check('course_language', 'Course language is required')
          .not()
          .isEmpty(),
          check('course_period', 'Course period must be I or II')
              .isIn(['I', 'II']),
          check('course_cfu', 'Course CFU is required')
          .not()
          .isEmpty(),
          check('course_year', 'Course year must be I, II, III, IV or V')
              .isIn(['I', 'II', 'III', 'IV', 'V']),
          check('course_type', 'Course type is required')
          .not()
          .isEmpty(),
          check('course_scientific_area', 'Course type is required')
          .not()
          .isEmpty(),
          check('course_mandatory', 'Course type is required')
          .not()
          .isEmpty(),
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
        if (user.user_role !== "admin") {
            return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
        }
  
        const new_course = new Course({
          course_name: req.body.course_name,
          course_degree: req.body.course_degree,
          course_faculty: req.body.course_faculty,
          course_language: req.body.course_language,
          course_period: req.body.course_period,
          course_cfu: req.body.course_cfu,
          course_year: req.body.course_year,
          course_type: req.body.course_type,
          course_scientific_area: req.body.course_scientific_area,
          course_mandatory: req.body.course_mandatory,
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
            check('course_faculty', 'Course faculty is required')
            .not()
            .isEmpty(),
            check('course_language', 'Course language is required')
            .not()
            .isEmpty(),
            check('course_period', 'Course period must be I or II')
                .isIn(['I', 'II']),
            check('course_cfu', 'Course CFU is required')
            .not()
            .isEmpty(),
            check('course_year', 'Course year must be I, II, III, IV or V')
                .isIn(['I', 'II', 'III', 'IV', 'V']),
            check('course_type', 'Course type is required')
            .not()
            .isEmpty(),
            check('course_scientific_area', 'Course type is required')
            .not()
            .isEmpty(),
            check('course_mandatory', 'Course type is required')
            .not()
            .isEmpty(),
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
        if (user.user_role !== "admin") {
            return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
        }

        const {
            course_name,
            course_degree,
            course_faculty,
            course_language,
            course_period,
            course_cfu,
            course_year,
            course_type,
            course_scientific_area,
            course_mandatory,
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
        if (course_faculty) {
            courseFields.course_faculty = course_faculty;
        }
        if (course_language) {
            courseFields.course_language = course_language;
        }
        if (course_period) {
            courseFields.course_period = course_period;
        }
        if (course_cfu) {
          courseFields.course_cfu = course_cfu;
        }
        if (course_year) {
            courseFields.course_year = course_year;
        }
        if (course_type) {
            courseFields.course_type = course_type;
        }
        if (course_scientific_area) {
            courseFields.course_scientific_area = course_scientific_area;
        }
        if (course_mandatory) {
            courseFields.course_mandatory = course_mandatory;
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
        if (user.user_role !== "admin") {
            return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
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
      if (user.user_role !== "teacher" && user.user_role !== "admin" ) {
          return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
      }

      const course = await Course.findById(req.params.course_id);
      if (!course) {
        return res.status(400).json({ msg: 'Course not found' });
      }

      const originalMetadata = await extract(req.files[0].path)
      const pythonProcess = spawn('python',[__dirname + '/../../utils/main.py', req.files[0].path])
      let readingEase;

      pythonProcess.stdout.on('data', (value) => {
        // Do something with the data returned from python script
        v = JSON.parse(value)
        readingEase = v.readibility;
        checkRatio = v.check_ratio;
        fontSize = v.font_size;
      });

      pythonProcess.on('close', (code) => {
        const newResource = {
          name: req.files[0].filename,
          resourceTopic: req.body.resourceTopic,
          adaptionType: req.body.adaptionType,
          displayTransformability: req.body.displayTransformability,
          accessMode: req.body.accessMode,
          resourceType: req.body.resourceType,
          resourceFontSize: req.body.resourceFontSize,
          resourceExtension: req.body.resourceExtension,
          resourceReadingEase: req.body.resourceReadingEase,
          resourceCheckRatio: req.body.resourceCheckRatio,
          metadata: {
            ...originalMetadata,
            readingEase: readingEase,
            checkRatio: checkRatio,
            fontSize: fontSize
          }
        };
        if (!course.course_resources) {
          course.course_resources = [ newResource ];
        } else {
          course.course_resources.unshift(newResource);
        }
        course.save();
        res.json({msg: "Resource uploaded"})
      });
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Course not found' });
      }
      res.status(500).send(err.message);
    }
  }
)

router.get(
  '/:facultyid',
  async (req, res) => {
    try {
      const courses = await Course.find({course_faculty: req.params.facultyid});
      if (!courses) {
        return res.status(400).json({ msg: 'Courses not found '});
      }
      res.json(courses);
    } catch (err) {
      console.error(err.message);
      if (err.kind === 'ObjectId') {
        return res.status(400).json({ msg: 'Courses not found '});
      }
      res.status(500).send(err.message);
    }
  }
);
  
module.exports = router;