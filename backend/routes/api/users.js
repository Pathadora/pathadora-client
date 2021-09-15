const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
const { check, validationResult } = require('express-validator');

const User = require('../../model/user.model');

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
    .isLength({ min: 6 })
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
        user_role : req.body.user_role
      });
      await user.save();

      // Return jsonwebtoken (login after registration)

      const payload = {
        user: {
          id: user._id
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

module.exports = router;
