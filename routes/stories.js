let router = require('express').Router();
let { ensureAutheticated } = require('../helpers/auth');
let Story = require('../models/Story');

router.get('/', (req, res) => {
  Story.find({ status: 'public' }, (err, stories) => {
    res.render('stories/index', { stories });
  }).populate('user');
});

// User Stories
router.get('/user/:userId', (req, res) => {
  Story.find({ status: 'public', user: req.params.userId }, (err, stories) =>
    res.render('stories/index', { stories })
  ).populate('user');
});

// Logged user stories
router.get('/my', (req, res) => {
  Story.find({ user: req.user.id }, (err, stories) =>
    res.render('stories/index', { stories })
  ).populate('user');
});

// Add Story form
router.get('/add', ensureAutheticated, (req, res) => {
  res.render('stories/add');
});

// Edit Story form
router.get('/edit/:id', ensureAutheticated, (req, res) => {
  Story.findOne({ _id: req.params.id }, (err, story) => {
    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', { story });
    }
  });
});

// Show Story
router.get('/show/:id', (req, res) => {
  Story.findOne({ _id: req.params.id }, (err, story) => {
    if (story.status == 'public') {
      res.render(`stories/show`, { story });
    } else {
      if (req.user && story && story.user.id == req.user.id) {
        res.render(`stories/show`, { story });
      } else {
        res.redirect('/stories');
      }
    }
  })
    .populate('user')
    .populate('comments.commentUser');
});

// Add story
router.post('/', (req, res) => {
  let allowComment = false;

  if (req.body.allowComment) {
    allowComment = true;
  }

  let newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComment,
    user: req.user.id
  };

  new Story(newStory).save().then(story => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

// Delete story
router.delete('/:id', (req, res) => {
  let _id = req.params.id;
  Story.deleteOne({ _id }, err => {
    res.redirect(`/dashboard`);
  });
});

// Put story
router.put('/:id', (req, res) => {
  Story.findOne({ _id: req.params.id }, (err, story) => {
    let allowComment = false;
    console.log(req.body.allowComment);
    if (req.body.allowComment) {
      allowComment = true;
    }

    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComment = allowComment;

    story.save({}, (err, story) => {
      console.log(story);
      res.redirect('/dashboard');
    });
  });
});

// Add Comment
router.post('/comment/:id', (req, res) => {
  Story.findOne({ _id: req.params.id }, (err, story) => {
    if (err) {
      throw err;
    }

    let newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    // Add comment to comments
    story.comments.unshift(newComment);

    story.save({}, (err, story) => {
      if (err) throw err;

      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;
