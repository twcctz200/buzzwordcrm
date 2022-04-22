const express = require('express');
const { isUserAuthenticated, formatEventDateTime } = require('../utils');
const CalendlyService = require('../services/calendlyService');
const router = express.Router();

router
    .get('/', (req, res) => {
        res.render('index');
    })
    .get('/logout', (req, res) => {
        if (req.user) {
            req.session = null;
        }
        res.redirect('/');
    })
    .get('/events', isUserAuthenticated, async (req, res) => {
        const { access_token, refresh_token, calendly_uid } = req.user;
        const calendlyService = new CalendlyService(
            access_token,
            refresh_token
        );
        const {
            collection,
            pagination
        } = await calendlyService.getUserScheduledEvents(calendly_uid);
        const events = collection.map(formatEventDateTime);

        res.render('events', { isLoggedIn: true, events, pagination });
    })
    .get('*', (req, res) => {
        res.render('index');
    });

module.exports = router;
