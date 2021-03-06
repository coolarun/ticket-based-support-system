// delete answer route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _router = express.Router()
const answerModel = mongoose.model('answerModel');
const jwtVerification = require('../../customMiddlewares/jwtVerification');


module.exports = (app, responseFormat) => {

    _router.post('/deleteanswer', jwtVerification, (req, res) => {

        // check for empty field
        if (!req.body.answerId) {
            let response = responseFormat(true, 'answer id is missing', 400, null);
            return res.json(response);
        }

        answerModel.findById({ "_id": req.body.answerId }, function(err, answer) {
            if (err) {
                console.log(err);
            }

            if (!answer) {
                let response = responseFormat(true, 'there is no answer available with this answer id', 400, null);
                return res.json(response);
            }

            if (!(req.decoded._id === answer.answeredBy.toString())) {
                let response = responseFormat(true, 'you are not authorize to delete this answer', 400, null);
                return res.json(response);
            }

            answer.remove((err) => {
                if (err) {
                    console.log(err)
                }

                let response = responseFormat(false, 'answer successfully deleted', 200, null);
                return res.json(response);

            })
        })

    }) // end


    // mount the router as an app level middleware
    app.use('/api', _router);

} // end