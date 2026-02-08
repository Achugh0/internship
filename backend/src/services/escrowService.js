import Razorpay from 'razorpay';
import { pgPool } from '../config/database.js';
import Company from '../models/Company.js';
import logger from '../utils/logger.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createEscrowDeposit = async (companyId, internshipId, amount) => {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `escrow_${internshipId}_${Date.now()}`,
      notes: {
        type: 'escrow_deposit',
        companyId,
        internshipId
      }
    });

    await pgPool.query(
      `INSERT INTO escrow_transactions 
       (company_id, internship_id, amount, status, payment_gateway_id) 
       VALUES ($1, $2, $3, $4, $5)`,
      [companyId, internshipId, amount, 'pending', order.id]
    );

    return order;
  } catch (error) {
    logger.error('Escrow deposit creation failed:', error);
    throw error;
  }
};

export const confirmEscrowDeposit = async (orderId, paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === 'captured') {
      await pgPool.query(
        `UPDATE escrow_transactions 
         SET status = 'held', deposited_at = NOW() 
         WHERE payment_gateway_id = $1`,
        [orderId]
      );

      const transaction = await pgPool.query(
        'SELECT company_id, amount FROM escrow_transactions WHERE payment_gateway_id = $1',
        [orderId]
      );

      const { company_id, amount } = transaction.rows[0];

      await Company.findByIdAndUpdate(company_id, {
        $inc: { 'escrowAccount.balance': amount },
        $push: { 
          'escrowAccount.deposits': { 
            amount, 
            internshipId: transaction.rows[0].internship_id, 
            date: new Date() 
          }
        }
      });

      return { success: true };
    }

    return { success: false, reason: 'Payment not captured' };
  } catch (error) {
    logger.error('Escrow confirmation failed:', error);
    throw error;
  }
};

export const releaseEscrow = async (transactionId, studentId) => {
  try {
    const transaction = await pgPool.query(
      'SELECT * FROM escrow_transactions WHERE id = $1 AND status = $2',
      [transactionId, 'held']
    );

    if (transaction.rows.length === 0) {
      throw new Error('Transaction not found or already processed');
    }

    const { amount, company_id } = transaction.rows[0];

    await pgPool.query(
      `UPDATE escrow_transactions 
       SET status = 'released', student_id = $1, released_at = NOW() 
       WHERE id = $2`,
      [studentId, transactionId]
    );

    await Company.findByIdAndUpdate(company_id, {
      $inc: { 'escrowAccount.balance': -amount }
    });

    logger.info(`Escrow released: ${amount} to student ${studentId}`);
    return { success: true, amount };
  } catch (error) {
    logger.error('Escrow release failed:', error);
    throw error;
  }
};

export const autoReleaseEscrow = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const eligibleTransactions = await pgPool.query(
    `SELECT id, student_id FROM escrow_transactions 
     WHERE status = 'held' AND deposited_at <= $1`,
    [thirtyDaysAgo]
  );

  for (const transaction of eligibleTransactions.rows) {
    await releaseEscrow(transaction.id, transaction.student_id);
  }

  logger.info(`Auto-released ${eligibleTransactions.rows.length} escrow transactions`);
};
