const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const amqp = require('amqplib/callback_api')
const Contact = require("./../models/Contact")
const Group = require("./../models/Group")

router.get('/ping', function(req, res, next) {
    res.json({ message: 'pong' });
});

router.post('/contacts', (req, res, next) => {
    Contact.create({
        _id: uuid.v4(),
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        countryCode: req.body.countryCode,
        groups: req.body.groups
    }, (err, cont) => {
        if (err) next(err)
        console.log("contact created " + cont)
        res.json(cont)
    })
})

router.get('/contacts', (req, res, next) => {
    Contact.find({}, null, (err, contacts) => {
        if (err) next(err)
        res.json(contacts)
    })
})

router.get('/contacts/:id', (req, res, next) => {
    Contact.findOne({ _id: req.params.id }, null, (err, contact) => {
        if (err) next(err)
        res.json(contact)
    })
})

router.put('/contacts/:id', (req, res, next) => {
    Contact.updateOne({ _id: req.params.id }, req.body, (err, contact) => {
        if (err) next(err)
        res.json(contact)
    })
})


router.delete('/contacts/:id', (req, res, next) => {
    Contact.deleteOne({ _id: req.params.id }, (err) => {
        if (err) next(err)
        res.json("deleted")
    })
})


router.post('/groups', (req, res, next) => {
    Group.create({
        _id: uuid.v4(),
        name: req.body.name,
    }, (err, cont) => {
        if (err) next(err)
        console.log("group created " + cont)
        res.json(cont)
    })
})

router.get('/groups', (req, res, next) => {
    Group.find({}, null, (err, groups) => {
        if (err) next(err)
        res.json(groups)
    })
})

router.get('/groups/:id', (req, res, next) => {
    Group.findOne({ _id: req.params.id }, null, (err, group) => {
        if (err) next(err)
        res.json(group)
    })
})

router.put('/groups/:id', (req, res, next) => {
    Group.updateOne({ _id: req.params.id }, req.body, (err, group) => {
        if (err) next(err)
        res.json(group)
    })
})


router.delete('/groups/:id', (req, res, next) => {
    Group.deleteOne({ _id: req.params.id }, (err) => {
        if (err) next(err)
        res.json("deleted")
    })
})



router.post('/email', function(req, res, next) {

    if (!req.body.message || req.body.message.length < 10 || !req.body.recepients || req.body.recepients.length === 0) {
        console.log("rejecting", req.body)
        res.status(400).json({ status: "rejected" })
    }

    amqp.connect(process.env.RMQ_CXN, (err, cxn) => {
        if (err) { next(err) }

        cxn.createChannel((err, ch) => {
            if (err) { next(err) }

            req.body.recepients.map(r => {
                let jr = new Object()
                jr.recepient = r
                jr.message = req.body.message
                let jsonString = JSON.stringify(jr)
                ch.sendToQueue("email", Buffer.from(jsonString))
                console.log("email despatch:", jsonString)
            })

            res.json({ status: "queued" })

        })
    })

});

router.post('/sms', function(req, res, next) {

    if (!req.body.message || req.body.message.length < 5 || !req.body.recepients || req.body.recepients.length === 0) {
        console.log("rejecting", req.body)
        res.status(400).json({ status: "rejected" })
    }

    amqp.connect(process.env.RMQ_CXN, (err, cxn) => {
        if (err) { next(err) }

        cxn.createChannel((err, ch) => {
            if (err) { next(err) }

            req.body.recepients.map(r => {
                let jr = new Object()
                jr.recepient = r
                jr.message = req.body.message
                let jsonString = JSON.stringify(jr)
                ch.sendToQueue("sms", Buffer.from(jsonString))
                console.log("sms despatch:", jsonString)
            })

            res.json({ status: "queued" })

        })
    })

});

router.get('/doom', function(req, res, next) {
    next(new Error("boom"))
});

module.exports = router;