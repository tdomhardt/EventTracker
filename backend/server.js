import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Event from './models/Event';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://[localhost]/events');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

router.route('/events/add').post((req, res) => {
    let event = new Event(req.body);
    event.save()
        .then(event => {
            res.status(200).json({'event': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/events').get((req, res) => {
    Event.find((err, events) => {
        if (err)
            console.log(err);
        else
            res.json(events);
    });
});

router.route('/events/:id').get((req, res) => {
    Event.findById(req.params.id, (err, event) => {
        if (err)
            console.log(err);
        else
            res.json(event);
    })
});

router.route('/events/update/:id').post((req, res) => {
    Event.findById(req.params.id, (err, event) => {
        if (!event)
            return next(new Error('Could not load Document'));
        else {
            event.title = req.body.title;
            event.description = req.body.description;
            event.date = req.body.date;
            event.status = req.body.status;

            event.save().then(event => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/events/delete/:id').get((req, res) => {
    Event.findByIdAndRemove({_id: req.params.id}, (err, event) => {
        if (err)
            res.json(err);
        else
            res.json('Removed successfully');
    });
});

app.use('/', router);

app.listen(4000, () => console.log(`Express server running on port 4000`));