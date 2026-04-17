const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth'); // Assume auth middleware exists

// Create a new booking
router.post('/', auth, async (req, res) => {
  try {
    const { property, date, timeSlot } = req.body;
    
    // Basic validation
    if (!property || !date || !timeSlot) {
      return res.status(400).json({ error: 'Please provide all fields' });
    }

    // Date validation
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ error: 'Cannot book a date in the past' });
    }

    // Check for duplicate booking slot for the same property
    const existingBooking = await Booking.findOne({ property, date, timeSlot });
    if (existingBooking) {
      return res.status(400).json({ error: 'This time slot is already booked for this property.' });
    }
    
    const newBooking = new Booking({
      property,
      user: req.user.id,
      date,
      timeSlot
    });
    
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('property', 'title location price imageUrl')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings for properties owned by the user
router.get('/manage', auth, async (req, res) => {
  try {
    const properties = await require('../models/Property').find({ owner: req.user.id });
    const propertyIds = properties.map(p => p._id);
    
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title location images imageUrl isAvailable')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
      
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch management bookings' });
  }
});

// Update booking status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('property');
    
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    
    // Ensure the user owns the property
    if (booking.property.owner.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

module.exports = router;
