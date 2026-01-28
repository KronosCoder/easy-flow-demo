'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BudgetProvider } from '@/context/BudgetContext';
import Navbar from '@/components/Navbar';
import SummaryCards from '@/components/SummaryCards';
import BudgetChart from '@/components/BudgetChart';
import TransactionList from '@/components/TransactionList';
import TransactionForm from '@/components/TransactionForm';
import { pageTransition } from '@/lib/animations';

function DashboardContent() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            pageTransition(containerRef.current);
        }
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen pb-24 relative">
            <Navbar />

            <main className="container flex flex-col gap-4">
                {/* Summary Cards */}
                <SummaryCards />

                {/* Charts */}
                <BudgetChart />

                {/* Transaction List */}
                <TransactionList />
            </main>

            {/* Floating Add Button */}
            <button
                onClick={() => setIsFormOpen(true)}
                className="sticky bottom-6 left-2/2 transform -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl shadow-purple-500/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-40"
            >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Transaction Form Modal */}
            <TransactionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </div>
    );
}

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-400">กำลังโหลด...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <BudgetProvider>
            <DashboardContent />
        </BudgetProvider>
    );
}
