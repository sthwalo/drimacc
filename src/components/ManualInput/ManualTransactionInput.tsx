import React, { useState } from 'react';

// Define the props if needed, for now, we assume no props are passed
interface Props {}

// Define the state interface for the transaction details
interface TransactionInput {
    amount: number;
    description: string;
}

const ManualTransactionInput: React.FC<Props> = () => {
    // State to hold the transaction inputs
    const [transaction, setTransaction] = useState<TransactionInput>({ amount: 0, description: '' });

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTransaction(prev => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting transaction:', transaction);
        // Add logic to process the transaction data
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="amount">Amount:</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={transaction.amount}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={transaction.description}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Submit Transaction</button>
        </form>
    );
};

export default ManualTransactionInput;
