const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
const { check, validationResult, oneOf } = require('express-validator');

const User = require('../../model/user.model');
const Course = require('../../model/course.model');

router.post(
  '/register',
  [
    check('user_email', 'Inserisci un indirizzo e-mail valido')
    .isEmail(),
    check('user_username', 'L\'username è obbligatorio')
    .not()
    .isEmpty(),
    check('user_name', 'Il nome è obbligatorio')
    .not()
    .isEmpty(),
    check('user_birthDate').isISO8601().toDate(),
    check('user_lastname', 'Il cognome è obbligatorio')
    .not()
    .isEmpty(),
    check('user_password', 'La password deve contenere almeno 6 caratteri')
    .isLength({ min: 6 }),
    oneOf([
      check('user_courses').not().exists(),
      check('user_courses').isArray()
    ])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user already exists
      let user = await User.findOne({ user_email : req.body.user_email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'L\'indirizzo email inserito è già utilizzato'}] });
      }
      user = await User.findOne({ user_username : req.body.user_username });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'Il nome utente inserito è già utilizzato'}] });
      }

      // Get user gravatar
      const avatar = gravatar.url(req.body.user_email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      // Encryt password

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.user_password, salt);

      const roles = ['user', 'teacher', 'admin']

      const role = roles.includes(req.body.user_role) ? req.body.user_role : 'user'

      user = new User({
        user_email : req.body.user_email,
        user_username : req.body.user_username,
        user_name : req.body.user_name,
        user_lastname : req.body.user_lastname,
        user_gender: req.body.user_gender,
        user_password : hashedPassword,
        user_birthDate : req.body.user_birthDate,
        user_avatar : avatar,
        user_role : role
      });
      if (role === 'teacher' && req.body.user_courses && Array.isArray(req.body.user_courses) && req.body.user_courses.length > 0) {
        user.user_courses = req.body.user_courses
      }
      await user.save();

      // Return jsonwebtoken (login after registration)

      const payload = {
        user: {
          _id: user._id
        }
      };

      jwt.sign(
        payload,
        config.jwtToken,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }

  }
);

router.get(
  '/',
  auth,
  async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

router.get(
  '/me',
  auth,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return res.status(400).json({ msg: 'User not found'});
      }
      res.json(user);
    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

router.get(
  '/courses',
  auth,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return res.status(400).json({ msg: 'User not found'});
      }
      if (user.user_role !== "teacher" && user.user_role !== "admin") {
        return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
      }
      if (!user.user_courses || !Array.isArray(user.user_courses)) {
        res.json([])
      } else {
        const user_courses = await Promise.all(
          user.user_courses.map(async (c_id, i) => await Course.findOne({ _id: c_id })).filter(c => c)
        )
        res.json(user_courses);
      }
    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

// array of ids
router.post(
  '/courses',
  [
    auth,
    [
      oneOf([
        check('user_courses').not().exists(),
        check('user_courses').isArray()
      ])
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      user_courses_ids
    } = req.body;
    try {
      const user = await User.findById(req.user._id)
      if (!user) {
        return res.status(400).json({ msg: 'User not found'});
      }
      if (user.user_role !== "teacher" && user.user_role !== "admin") {
        return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
      }
      if (!user.user_courses) {
        user.user_courses = user_courses_ids;
      } else {
        user.user_courses.push(user_courses_ids);
      }
      await user.save();

      const user_courses = await Promise.all(
        user.user_courses.map(async (c_id, i) => await Course.findOne({ _id: c_id })).filter(c => c)
      )
      res.json(user_courses);
    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

router.delete(
  '/courses/:id',
  auth,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user._id });
      if (!user) {
        return res.status(400).json({ msg: 'User not found'});
      }
      if (user.user_role !== "teacher" && user.user_role !== "admin") {
        return res.status(401).json({ errors: [{ msg: 'User not authorized' }] });
      }
      if (!user.user_courses || !Array.isArray(user.user_courses)) {
        res.json([])
      } else {
        user.user_courses = user.user_courses.filter(c => c._id != req.params.id)
        await user.save();

        const user_courses = await Promise.all(
          user.user_courses.map(async (c_id, i) => await Course.findOne({ _id: c_id })).filter(c => c)
        )
        res.json(user_courses);
      }
    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
