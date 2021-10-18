const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult, oneOf } = require('express-validator');

const Department = require('../../model/department.model');
const User = require('../../model/user.model');

router.get(
    '/',
    async (req, res) => {
      try {
        const departments = await Department.find();
        res.json(departments);
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
        const department = await Department.findById(req.params.id);
        if (!department) {
          return res.status(400).json({ msg: 'Department not found '});
        }
        res.json(department);
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(400).json({ msg: 'Department not found '});
        }
        res.status(500).send(err.message);
      }
    }
  );

  router.post(
    '/',
    [ auth,
      [
        check('department_name', 'Department name is required')
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
  
        const new_department = new Department({
          department_name: req.body.department_name
        });
        const department = await new_department.save();
        res.json(department);
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
            check('department_name', 'Department name is required')
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
        const department = await Department.findById(req.params.id);
        if (!department) {
          return res.status(400).json({ msg: 'Department not found '});
        }
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
          return res.status(400).json({ errors: [{ msg: 'User not found' }] });
        }
        if (user.user_role !== "admin") {
            return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
        }

        const {
            department_name
        } = req.body;
        const departmentFields = {};
        if (department_name) {
            departmentFields.department_name = department_name;
        }

        const updatedDepartment = await Department.findOneAndUpdate(
            { _id: req.params.id },
            { $set: departmentFields },
            { new: true }
        );
          if (!updatedDepartment) {
            return res.status(400).json({ msg: 'Department not found '});
          }
          res.json(await updatedDepartment.save());
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

        const department = await Department.findById(req.params.id);
        if (!department) {
          return res.status(400).json({ msg: 'Department not found' });
        }

        await department.remove();
        res.json({ msg: "Department removed" });
      } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(400).json({ msg: 'Department not found' });
        }
        res.status(500).send(err.message);
      }
    }
  );

module.exports = router;