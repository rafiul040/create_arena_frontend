import React from 'react';
import { Link } from 'react-router';

const PaymentCancelled = () => {
    return (
        <div>
            <title>Payment Cancelled | Create Arena</title>
            <h2>
            Payment is Cancelled. Please Try Again
            </h2>
            <Link to="/all_contests">
            <button className='btn btn-secondary'>
            Try  Again
            </button>
            </Link>
        </div>
    );
};

export default PaymentCancelled;