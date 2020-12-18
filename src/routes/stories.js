const express = require("express");
const { ensureAuth } = require("../middleware/auth");
const mongoose = require("mongoose");
const router = express.Router();

const Story = require("../models/Story");

// @desc Show Add Page
// @route GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc Add Story
// @route POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// @desc GET Public Stories
// @route GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({})
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// @desc GET Only One Public Story
// @route GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findById({ _id: req.params.id })
      .populate("user")
      .lean();

    if (!story) {
      res.redirect("error/404");
    }
    res.render("stories/show", {
      story,
    });
  } catch (error) {
    console.error(error);
    return res.render("error/404");
  }
});

// @desc Edit Public Story
// @route GET /stories/edit
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    if (!story) {
      res.render("error/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story,
      });
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// @desc Edit PUT Request
// @route PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById({ _id: req.params.id });
    if (!story) {
      res.render("error/404");
    }
    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// @desc Delete Story Request
// @route DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

// @desc Show User Stories
// @route GET /stories/user/:UserId
router.get("/user/:userid", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userid,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});
module.exports = router;
