const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchcontrollers');

// Render the index view with a list of all batches
router.get('/', batchController.getAllBatches);

// Render the view to create a new batch
//router.get('/create', batchController.createBatchView);
router.post('/create',batchController.addBatch)
// Render the view for a specific batch
router.delete('/:id', batchController.deleteBatch);

// Render the view to edit a specific batch
router.put('/:id', batchController.updateBatch);

module.exports = router;
