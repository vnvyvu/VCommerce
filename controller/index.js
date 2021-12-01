module.exports={
    redirect: (req, res, next)=>{
        res.redirect("/en");
    },
    index: (req, res, next)=>{
        res.send(req.lang);
    }
}