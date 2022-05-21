module.exports = (req, res, next) => {
    // checks if the user is the owner when trying to access a specific page
    console.log()
    
    
    if (req.session.user._id === 'inside owner property of the room document') {
      
        return res.redirect("/auth/login");
      
    }
    req.user = req.session.user;
    next();
  };