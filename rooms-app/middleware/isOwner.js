module.exports = (req, res, next) => {
    // checks if the user is the owner when trying to access a specific page
    console.log(req.session.user)
    console.log(req.paramss)
    if (req.session.user == 'owner') {
      
        return res.redirect("/auth/login");
      
    }
    req.user = req.session.user;
    next();
  };