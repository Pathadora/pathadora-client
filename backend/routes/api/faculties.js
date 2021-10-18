const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, oneOf } = require('express-validator');

const Faculty = require('../../model/faculty.model');
const User = require('../../model/user.model');

router.get(
    '/',
    async (req, res) => {
      try {
        const faculties = await Faculty.find();
        res.json(faculties);
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
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) {
          return res.status(400).json({ msg: 'Faculty not found '});
        }
        res.json(faculty);
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(400).json({ msg: 'Faculty not found '});
        }
        res.status(500).send(err.message);
      }
    }
  );

  router.post(
    '/',
    [ auth,
      [
        check('faculty_name', 'Faculty name is required')
        .not()
        .isEmpty(),
        check('faculty_department', 'Faculty department is required')
        .not()
        .isEmpty()
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
  
        const new_faculty = new Faculty({
          faculty_name: req.body.faculty_name,
          faculty_department: req.body.faculty_department
        });
        const faculty = await new_faculty.save();
        res.json(faculty);
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
            check('faculty_name', 'Faculty name is required')
            .not()
            .isEmpty(),
            check('faculty_department', 'Faculty department is required')
            .not()
            .isEmpty()
        ]
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json( { errors: errors.array() });
      }
      try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) {
          return res.status(400).json({ msg: 'Faculty not found '});
        }
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }
        if (user.user_role !== "admin") {
            return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
        }

        const {
            faculty_name,
            faculty_department
        } = req.body;
        const facultyFields = {};
        if (faculty_name) {
            facultyFields.faculty_name = faculty_name;
        }
        if (faculty_department) {
            facultyFields.faculty_department = faculty_department;
        }

        const updatedFaculty = await Faculty.findOneAndUpdate(
            { _id: req.params.id },
            { $set: facultyFields },
            { new: true }
        );
          if (!updatedFaculty) {
            return res.status(400).json({ msg: 'Faculty not found '});
          }
          res.json(await updatedFaculty.save());
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

        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) {
          return res.status(400).json({ msg: 'Faculty not found' });
        }

        await faculty.remove();
        res.json({ msg: "Faculty removed" });
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(400).json({ msg: 'Faculty not found' });
        }
        res.status(500).send(err.message);
      }
    }
  );

  router.get(
    '/department/:departmentid',
    async (req, res) => {
      try {
        const faculties = await Faculty.find({faculty_department: req.params.departmentid});
        if (!faculties) {
          return res.status(400).json({ msg: 'Faculties not found'});
        }
        res.json(faculties);
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(400).json({ msg: 'Faculties not found'});
        }
        res.status(500).send(err.message);
      }
    }
  );
  
module.exports = router;