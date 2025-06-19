const express = require('express');
const router = express.Router();
const mangaControllers = require('../controller/mangaControllers');

// Rotte specifiche:
router.get('/series', mangaControllers.getSeries);
router.get('/series/:slug', mangaControllers.getMangaBySeries);
router.get('/newRelease', mangaControllers.newRelease);
router.get('/popularity', mangaControllers.getPopularity);
router.get('/genre', mangaControllers.getGenre);
router.post('/order', mangaControllers.createOrder)
router.get('/promo_code', mangaControllers.getPromoCode);

// Rotte più generiche:
router.get('/', mangaControllers.index);
router.get('/:slug', mangaControllers.show);


module.exports = router;