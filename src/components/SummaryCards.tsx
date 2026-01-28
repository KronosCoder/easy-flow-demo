'use client';

import { useEffect, useRef } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { animateCards, animateNumber } from '@/lib/animations';

export default function SummaryCards() {
    const { getTotalIncome, getTotalExpense, getBalance, getCurrentMonthData } = useBudget();
    const containerRef = useRef<HTMLDivElement>(null);
    const incomeRef = useRef<HTMLSpanElement>(null);
    const expenseRef = useRef<HTMLSpanElement>(null);
    const balanceRef = useRef<HTMLSpanElement>(null);

    const currentMonth = getCurrentMonthData();
    const monthlyIncome = currentMonth?.income || 0;
    const monthlyExpense = currentMonth?.expense || 0;
    const monthlyBalance = monthlyIncome - monthlyExpense;

    useEffect(() => {
        if (containerRef.current) {
            const cards = containerRef.current.querySelectorAll('.summary-card');
            animateCards(cards);
        }

        // Animate numbers
        setTimeout(() => {
            animateNumber(incomeRef.current, monthlyIncome, 1.2);
            animateNumber(expenseRef.current, monthlyExpense, 1.2);
            animateNumber(balanceRef.current, monthlyBalance, 1.5);
        }, 300);
    }, [monthlyIncome, monthlyExpense, monthlyBalance]);

    const currentMonthName = new Date().toLocaleDateString('th-TH', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div ref={containerRef}>
            <h2 className="text-lg font-medium text-gray-400 mb-4">
                สรุปประจำเดือน {currentMonthName}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Income Card */}
                <div className="summary-card card card-income text-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-white/80 text-sm">รายรับ</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold">
                        ฿<span ref={incomeRef}>0</span>
                    </div>
                </div>

                {/* Expense Card */}
                <div className="summary-card card card-expense text-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-white/80 text-sm">รายจ่าย</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold">
                        ฿<span ref={expenseRef}>0</span>
                    </div>
                </div>

                {/* Balance Card */}
                <div className="summary-card card card-balance text-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-white/80 text-sm">คงเหลือ</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold">
                        ฿<span ref={balanceRef}>0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
