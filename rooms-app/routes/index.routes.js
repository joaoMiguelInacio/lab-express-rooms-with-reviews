const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  if (req.session.user) {
    const isUser = true;
    res.render("index", {isUser});
  } else {
    const isAnonymous = true;
    res.render("index", {isAnonymous});
  } 
});

module.exports = router;