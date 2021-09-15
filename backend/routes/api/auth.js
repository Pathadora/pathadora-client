const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/default.json');
const { check, validationResult } = require('express-validator');

const User = require('../../model/user.model');

router.get(
  '/',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(400).json({ msg: "This user doesn\'t exist"});
      }
      res.json(user);
    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/',
  [
    check('user_username', 'Inserisci l\'username')
    .not()
    .isEmpty(),
    check('user_password', 'Inserisci la password')
    .not()
    .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user exists
      let user = await User.findOne({ user_username : req.body.user_username });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Credenziali non valide' }] });
      }

      // Check if password matches
      const isMatch = await bcrypt.compare(req.body.user_password, user.user_password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Credenziali non valide' }] });
      }

      // Return jsonwebtoken

      const payload = {
        user
      };

      const {
        _id,
        user_username,
        user_password,
        user_name,
        user_lastname,
        user_gender,
        user_role,
        user_birthDate,
        user_avatar,
        user_registrationDate
      } = user

      jwt.sign(
        payload,
        config.jwtToken,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ _id,
            user_username,
            user_password,
            user_name,
            user_lastname,
            user_gender,
            user_role,
            user_birthDate,
            user_avatar,
            user_registrationDate,
            token });
        }
      );

    } catch(err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }

  }
);

module.exports = router;
