'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, BudgetState, MonthlyData } from '@/types';

interface BudgetContextType extends BudgetState {
    addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
    deleteTransaction: (id: string) => void;
    getMonthlyData: () => MonthlyData[];
    getTotalIncome: () => number;
    getTotalExpense: () => number;
    getBalance: () => number;
    getCurrentMonthData: () => MonthlyData | null;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

// Generate sample transactions for demo
const generateSampleTransactions = (): Transaction[] => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return [
        {
            id: '1',
            type: 'income',
            amount: 45000,
            category: 'เงินเดือน',
            description: 'เงินเดือนประจำเดือน',
            date: new Date(currentYear, currentMonth, 1).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 1).toISOString(),
        },
        {
            id: '2',
            type: 'expense',
            amount: 12000,
            category: 'ที่พัก',
            description: 'ค่าเช่าห้อง',
            date: new Date(currentYear, currentMonth, 5).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 5).toISOString(),
        },
        {
            id: '3',
            type: 'expense',
            amount: 3500,
            category: 'อาหาร',
            description: 'ค่าอาหารสัปดาห์แรก',
            date: new Date(currentYear, currentMonth, 7).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 7).toISOString(),
        },
        {
            id: '4',
            type: 'expense',
            amount: 1500,
            category: 'เดินทาง',
            description: 'ค่าน้ำมันรถ',
            date: new Date(currentYear, currentMonth, 10).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 10).toISOString(),
        },
        {
            id: '5',
            type: 'income',
            amount: 5000,
            category: 'งานเสริม',
            description: 'รายได้งานฟรีแลนซ์',
            date: new Date(currentYear, currentMonth, 15).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 15).toISOString(),
        },
        {
            id: '6',
            type: 'expense',
            amount: 2500,
            category: 'สาธารณูปโภค',
            description: 'ค่าน้ำค่าไฟ',
            date: new Date(currentYear, currentMonth, 18).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 18).toISOString(),
        },
        {
            id: '7',
            type: 'expense',
            amount: 800,
            category: 'บันเทิง',
            description: 'ดูหนัง Netflix',
            date: new Date(currentYear, currentMonth, 20).toISOString(),
            createdAt: new Date(currentYear, currentMonth, 20).toISOString(),
        },
    ];
};

export function BudgetProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<BudgetState>({
        transactions: [],
        isLoading: true,
    });

    useEffect(() => {
        // Load transactions from localStorage or use sample data
        const saved = localStorage.getItem('budget_transactions');
        if (saved) {
            setState({ transactions: JSON.parse(saved), isLoading: false });
        } else {
            const sampleData = generateSampleTransactions();
            localStorage.setItem('budget_transactions', JSON.stringify(sampleData));
            setState({ transactions: sampleData, isLoading: false });
        }
    }, []);

    const saveTransactions = (transactions: Transaction[]) => {
        localStorage.setItem('budget_transactions', JSON.stringify(transactions));
    };

    const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };

        const updated = [...state.transactions, newTransaction];
        setState(prev => ({ ...prev, transactions: updated }));
        saveTransactions(updated);
    };

    const deleteTransaction = (id: string) => {
        const updated = state.transactions.filter(t => t.id !== id);
        setState(prev => ({ ...prev, transactions: updated }));
        saveTransactions(updated);
    };

    const getMonthlyData = (): MonthlyData[] => {
        const grouped = state.transactions.reduce((acc, transaction) => {
            const month = transaction.date.substring(0, 7); // YYYY-MM
            if (!acc[month]) {
                acc[month] = { month, income: 0, expense: 0, transactions: [] };
            }
            acc[month].transactions.push(transaction);
            if (transaction.type === 'income') {
                acc[month].income += transaction.amount;
            } else {
                acc[month].expense += transaction.amount;
            }
            return acc;
        }, {} as Record<string, MonthlyData>);

        return Object.values(grouped).sort((a, b) => b.month.localeCompare(a.month));
    };

    const getCurrentMonthData = (): MonthlyData | null => {
        const currentMonth = new Date().toISOString().substring(0, 7);
        const monthlyData = getMonthlyData();
        return monthlyData.find(m => m.month === currentMonth) || null;
    };

    const getTotalIncome = () => {
        return state.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const getTotalExpense = () => {
        return state.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const getBalance = () => {
        return getTotalIncome() - getTotalExpense();
    };

    return (
        <BudgetContext.Provider
            value={{
                ...state,
                addTransaction,
                deleteTransaction,
                getMonthlyData,
                getTotalIncome,
                getTotalExpense,
                getBalance,
                getCurrentMonthData,
            }}
        >
            {children}
        </BudgetContext.Provider>
    );
}

export function useBudget() {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
}
