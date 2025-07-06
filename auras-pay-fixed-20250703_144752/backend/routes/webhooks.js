const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

const router = express.Router();
const prisma = new PrismaClient();

// Stripe webhook endpoint
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await handleCheckoutSessionCompleted(session);
      break;
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentIntentSucceeded(paymentIntent);
      break;
    default:
      logger.warn(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Handle successful checkout session
const handleCheckoutSessionCompleted = async (session) => {
  try {
    const { client_reference_id, amount_total, customer_email } = session;
    
    if (!client_reference_id) {
      logger.error('No client_reference_id in checkout session');
      return;
    }

    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: client_reference_id }
    });

    if (!user) {
      logger.error(`User not found for ID: ${client_reference_id}`);
      return;
    }

    // Calculate credits based on amount
    const creditsToAdd = calculateCreditsFromAmount(amount_total);

    // Update user credits and create transaction record
    await prisma.$transaction(async (tx) => {
      // Add credits to user
      await tx.user.update({
        where: { id: user.id },
        data: {
          transactionCredits: {
            increment: creditsToAdd
          }
        }
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          creditsAdded: creditsToAdd,
          amountPaid: amount_total / 100, // Convert from cents
          paymentMethod: 'STRIPE',
          stripePaymentId: session.id,
          status: 'COMPLETED'
        }
      });
    });

    logger.info(`Credits added to user ${user.email}: ${creditsToAdd} credits for $${amount_total / 100}`);

  } catch (error) {
    logger.error('Error handling checkout session completed:', error);
  }
};

// Handle successful payment intent
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  try {
    logger.info(`Payment intent succeeded: ${paymentIntent.id}`);
    // Additional logic can be added here if needed
  } catch (error) {
    logger.error('Error handling payment intent succeeded:', error);
  }
};

// Calculate credits based on payment amount (in cents)
const calculateCreditsFromAmount = (amountInCents) => {
  const amount = amountInCents / 100; // Convert to dollars
  
  // Credit packages:
  // $10 = 100 credits
  // $40 = 500 credits  
  // $70 = 1000 credits
  
  if (amount >= 70) {
    return Math.floor(amount / 70) * 1000;
  } else if (amount >= 40) {
    return Math.floor(amount / 40) * 500;
  } else if (amount >= 10) {
    return Math.floor(amount / 10) * 100;
  } else {
    // For custom amounts, give 10 credits per dollar
    return Math.floor(amount * 10);
  }
};

module.exports = router; 