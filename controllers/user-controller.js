const { User, Thought, Reaction } = require('../models');

const userController = {
      // get all users
      getAllUsers(req, res) {
            User.find({})
                  .populate({
                        path: 'thoughts',
                        select: '-__v'
                  })
                  .select('-__v')
                  .sort({ _id: -1 })
                  .then(dbUserData => res.json(dbUserData))
                  .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                  });
      },

      // get one user by id
      getUserById({ params }, res) {
            User.findOne({ _id: params.id })
                  .populate({
                        path: 'thoughts',
                        select: '-__v'
                  })
                  .populate({
                        path: 'friends',
                        select: '-__v'
                  })
                  .select('-__v')
                  .then(dbUserData => {
                        if (!dbUserData) {
                              res.status(404).json({ message: 'No user found with this id!' });
                              return;
                        }
                        res.json(dbUserData);
                  })
                  .catch(err => {
                        console.log(err);
                        res.status(400).json(err);
                  });
      },

      // createUser
      createUser({ body }, res) {
            User.create(body)
                  .then(dbUserData => res.json(dbUserData))
                  .catch(err => res.status(400).json(err));
      },


      // update user by id
      updateUser({ params, body }, res) {
            User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
                  .then(dbUserData => {
                        if (!dbUserData) {
                              res.status(404).json({ message: 'No user found with this id!' });
                              return;
                        }
                        res.json(dbUserData);
                  })
                  .catch(err => res.status(400).json(err));
      },

      // delete user
      deleteUser({ params }, res) {
            User.findOneAndDelete({ _id: params.id })
                  .then(dbUserData => {
                        if (!dbUserData) {
                              return res.status(404).json({ message: 'No user found with this id!' });
                        }

                        return Thought.deleteMany({ _id: { $in: dbUserData.thoughts } })
                  })
                  .then(() => {
                        res.json({ message: 'user has been deleted.' });
                  })
                  .catch(err => res.status(400).json(err));

      },

      // add friend
      addFriend({ params }, res) {
            User.findOneAndUpdate({ _id: params.id }, { $addToSet: { friends: params.friendId } }, { runValidators: true })
                  .then(dbUserData => {
                        if (!dbUserData) {
                              res.status(404).json({ message: 'No user found with this id!' });
                              return;
                        }
                        res.json(dbUserData);
                  })
                  .catch(err => res.status(400).json(err));
      },

      // remove friend
      removeFriend({ params }, res) {
            User.findOneAndUpdate({ _id: params.id }, { $pull: { friends: params.friendId } }, { runValidators: true })
                  .then(dbUserData => {
                        if (!dbUserData) {
                              res.status(404).json({ message: 'No user found with this id!' });
                              return;
                        }
                        res.json(dbUserData);
                  })
                  .catch(err => res.status(400).json(err));
      },

      // delete user by id and remove associate thoughts

      // deleteUser({ params }, res) {
      //       User.findByIdAndDelete({ _id: params.id })
      //             .then(async (dbUserData) => {
      //                   const { username } = dbUserData;
      //                   if (!dbUserData) {
      //                         return res.status(404).json({ message: 'No user found with this id!' });
      //                   }
      //                   await Thought.deleteMany({ writtenBy: username });
      //                   res.json(dbUserData);
      //             })
      //             .then(() => {
      //                   res.json({ message: 'user with associate thoughts has been deleted.' });
      //             })
      //             .catch((err) = res.json(err));
      // },
      // deleteUser({ params }, res) {
      //       User.findById(req.params.user_id, function (err, user) {

      //             if (err)
      //                   return next(new restify.InternalError(err));
      //             else if (!user)
      //                   return next(new restify.ResourceNotFoundError('The resource you requested could not be found.'));

      //             // find and remove all associated sweepstakes
      //             Thought.find({ user_id: user._id }).remove();

      //             // find and remove all submissions
      //             //Reaction.find({ user_id: user._id }).remove();

      //             user.remove();

      //             res.send({ id: req.params.user_id });
      //       });
      // }
}


module.exports = userController;