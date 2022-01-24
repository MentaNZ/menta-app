const express = require('express');
const emojis = require('./emojis');
const { User, FlashCard, DeckLog } = require('./schema');

const router = express.Router();

// User operations
router.put('/user/create', async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    res.status(400).send('ERROR -- User email exists');
  } else {
    const newUser = User({
      email: req.body.email,
      pwd: req.body.pwd
    });
    try {
      newUser.save().then(() => {
        res.status(200).send(`SUCCESS -- User ${newUser._id} created`);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

router.post('/user/delete', async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    try {
      userExists.delete().then(() => {
        res.status(200).send(`SUCCESS -- Deleted user ${req.body.email}`);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('ERROR -- User does not exist');
  }
});

router.post('/user/login', async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    if (req.body.pwd === userExists.pwd) {
      res.status(200).send(`SUCCESS -- User ${userExists.email} logged in`);
    }
  }
  res.status(400).send('ERROR -- Email or password is incorrect');
});

router.post('/user/update', async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    if (userExists.pwd === req.body.pwd) {
      res.status(400).send('ERROR -- Password has been used before');
    } else {
      try {
        User.updateOne({ email: req.body.email }, { pwd: req.body.pwd }).then(() => {
          res.status(200).send(`SUCCESS -- User ${req.body.email} password changed`);
        });
      } catch (err) {
        res.status(400).send(err);
      }
    }
  } else {
    res.status(400).send('ERROR -- Could not update password');
  }
});

// Master flashcard operations
router.put('/flashcard/create', async (req, res) => {
  const cardExists = await FlashCard.findOne({ front: req.body.front });
  if (cardExists) {
    res.status(400).send('ERROR -- FlashCard with that front already exists');
  } else {
    const newCard = FlashCard({
      deck: req.body.deck,
      front: req.body.front,
      back: req.body.back
    });
    try {
      newCard.save().then(() => {
        res.status(200).send(`SUCCESS -- Card ${newCard._id} created`);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

router.post('/flashcard/delete', async (req, res) => {
  const cardExists = await FlashCard.findOne({ front: req.body.front });
  if (cardExists) {
    try {
      cardExists.delete().then(() => {
        res.status(200).send(`SUCCESS -- Card ${cardExists._id} deleted`);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('ERROR -- FlashCard with that front doesn\'t exist');
  }
});

router.post('/flashcard/deck', async (req, res) => {
  const deckExists = await FlashCard.findOne({ deck: req.body.deck });
  if (deckExists) {
    try {
      const deck = await FlashCard.find({ deck: req.body.deck });
      res.status(200).send(deck.map((card) => ({
        id: card._id,
        front: card.front,
        back: card.back
      })));
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('ERROR -- No cards in deck or deck doesn\'t exist');
  }
});

router.post('/flashcard/delete-deck', async (req, res) => {
  const deckExists = await FlashCard.findOne({ deck: req.body.deck });
  if (deckExists) {
    try {
      FlashCard.deleteMany({ deck: req.body.deck }).then(() => {
        res.status(200).send(`SUCCESS -- ${req.body.deck} deleted`);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('ERROR -- Deck doesn\'t exist');
  }
});

router.post('/flashcard/update', async (req, res) => {
  const cardExists = await FlashCard.findOne({ _id: req.body.id });
  if (cardExists) {
    try {
      if (req.body.field === 'front') {
        FlashCard.updateOne({ _id: req.body.id }, { front: req.body.content }).then(() => {
          res.status(200).send(`SUCCESS -- ${req.body.id} updated`);
        });
      } else if (req.body.field === 'back') {
        FlashCard.updateOne({ _id: req.body.id }, { back: req.body.content }).then(() => {
          res.status(200).send(`SUCCESS -- ${req.body.id} updated`);
        });
      } else {
        res.status(400).send('ERROR -- Specified field not found');
      }
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('ERROR -- Card doesn\'t exist');
  }
});

// Master flashcard update log
router.put('/decklog/create', async (req, res) => {
  const deckLogExists = await DeckLog.findOne({ deck: req.body.deck });
  if (deckLogExists) {
    res.status(400).send('ERROR -- DeckLog already exists');
  } else {
    const newDeckLog = DeckLog({
      deck: req.body.deck,
      last_changed: Date()
    });
    try {
      newDeckLog.save().then(() => {
        res.status(200).send(`SUCCESS -- New deck log for ${req.body.deck} created`);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  }
});

router.post('/decklog/delete', async (req, res) => {
  const deckLogExists = await DeckLog.findOne({ deck: req.body.deck });
  if (deckLogExists) {
    try {
      deckLogExists.delete().then(() => {
        res.status(200).send(`SUCCESS -- Deck log for ${deckLogExists.deck} deleted`);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('ERROR -- Deck log doesn\'t exist');
  }
});

router.post('/decklog/last-changed', async (req, res) => {
  const deckLogExists = await DeckLog.findOne({ deck: req.body.deck });
  if (deckLogExists) {
    try {
      res.status(200).send(deckLogExists.last_changed);
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('ERROR -- No log for this deck exists');
  }
});

router.post('/decklog/update', async (req, res) => {
  // cronjob this every 3 months or whenever sufficient changes need to propagate
  const deckLogExists = await DeckLog.findOne({ deck: req.body.deck });
  if (deckLogExists) {
    try {
      DeckLog.updateOne({ deck: req.body.deck }, { last_changed: Date() }).then(() => {
        res.status(200).send(`SUCCESS -- Deck log for ${deckLogExists.deck} updated`);
      });
    } catch (err) {
      res.status(400).send(err);
    }
  } else {
    res.status(400).send('ERROR -- Deck log doesn\'t exist');
  }
});

router.use('/emojis', emojis);

module.exports = router;
