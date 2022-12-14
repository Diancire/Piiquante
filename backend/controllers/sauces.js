const Sauces = require('../models/sauces');
// Package "fs" de Node qui donne accès aux fonctions qui permet de d'intéragir avec le système de fichiers
const fs = require('fs');

// Route pour accéder à toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error}));
}

// Route pour créer une sauce 
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauces({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };


// Route pour accéder à une sauce
exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}


// Route pour modifier la sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauces.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauces.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Sauce modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };

//  Route pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

// Route pour like ou dislike une sauce
exports.likeSauce = (req, res, next) => {
    Sauces.findOne({_id: req.params.id})
        .then((sauce) => {
            if(!sauce.usersLiked.includes(req.auth.userId) && req.body.like === 1) {
                Sauces.updateOne({_id: req.params.id}, {$inc:{likes: 1}, $push:{usersLiked: req.auth.userId}})
                .then(() => res.status(201).json({message: 'Like ajouté !'}))
                .catch(error => res.status(400).json({ error }));
            } else if (!sauce.usersDisliked.includes(req.auth.userId) && req.body.like === -1) {
                Sauces.updateOne({_id: req.params.id}, {$inc:{dislikes: 1}, $push:{usersDisliked: req.auth.userId}})
                .then(() => res.status(201).json({message: 'Dislike ajouté !'}))
                .catch(error => res.status(400).json({ error }));
            }
            else {
                if(sauce.usersLiked.includes(req.auth.userId) && req.body.like === 0) {
                    Sauces.updateOne({_id: req.params.id}, {$inc:{likes: -1}, $pull:{usersLiked: req.auth.userId}})
                    .then(() => res.status(201).json({message: 'Like supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
                } else if(sauce.usersDisliked.includes(req.auth.userId) && req.body.like === 0) {
                    Sauces.updateOne({_id: req.params.id}, {$inc:{dislikes: -1}, $pull:{usersDisliked: req.auth.userId}})
                    .then(() => res.status(201).json({message: 'Dislike supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
                }
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
}