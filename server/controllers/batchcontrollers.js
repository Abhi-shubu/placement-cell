const { Batch } = require('../models/batch');

// Controller to add a new batch
exports.addBatch = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;

    const newBatch = new Batch({
      name,
      startDate,
      endDate,
    });

    const savedBatch = await newBatch.save();

    if (!savedBatch) {
      return res.status(400).send('The batch could not be created!');
    }

    res.status(201).json(savedBatch);
  } catch (error) {
    console.error('Failed to create batch:', error);
    res.status(500).json({ success: false, error: 'An error occurred while creating the batch' });
  }
};

// Controller to update a batch
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate } = req.body;

    const updatedBatch = await Batch.findByIdAndUpdate(
      id,
      { name, startDate, endDate },
      { new: true }
    );

    if (!updatedBatch) {
      return res.status(404).send('Batch not found');
    }

    res.json(updatedBatch);
  } catch (error) {
    console.error('Failed to update batch:', error);
    res.status(500).json({ success: false, error: 'An error occurred while updating the batch' });
  }
};

// Controller to delete a batch
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBatch = await Batch.findByIdAndDelete(id);

    if (!deletedBatch) {
      return res.status(404).send('Batch not found');
    }

    res.json(deletedBatch);
  } catch (error) {
    console.error('Failed to delete batch:', error);
    res.status(500).json({ success: false, error: 'An error occurred while deleting the batch' });
  }
};

exports.getAllBatches = async (req, res) => {
  try {
    
    const allBatches = await Batch.find();

    
    if (!allBatches || allBatches.length === 0) {
      return res.status(404).json({ success: false, error: 'No batches found' });
    }

   
    res.json(allBatches);
  } catch (error) {
    console.error('Failed to get all batches:', error);
    res.status(500).json({ success: false, error: 'An error occurred while getting all batches' });
  }
};
