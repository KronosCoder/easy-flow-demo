'use client';

import { useBudget } from '@/context/BudgetContext';
import Swal from 'sweetalert2';

export default function TransactionList() {
    const { getMonthlyData, deleteTransaction } = useBudget();
    const monthlyData = getMonthlyData();

    const handleDelete = async (id: string, description: string) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ?',
            text: `ต้องการลบรายการ "${description}" หรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            background: '#1a1a2e',
            color: '#f8fafc',
            customClass: {
                popup: 'rounded-2xl border border-white/10',
            },
        });

        if (result.isConfirmed) {
            deleteTransaction(id);
            Swal.fire({
                title: 'ลบแล้ว!',
                text: 'รายการถูกลบเรียบร้อย',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1a1a2e',
                color: '#f8fafc',
                customClass: {
                    popup: 'rounded-2xl border border-white/10',
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
        });
    };

    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
    };

    if (monthlyData.length === 0) {
        return (
            <div className="card mt-8 text-center py-12">
                <div className="text-6xl mb-4">💰</div>
                <p className="text-gray-400">ยังไม่มีรายการ</p>
                <p className="text-gray-500 text-sm mt-2">เพิ่มรายการแรกของคุณเลย!</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-300 mb-4">
                รายการทั้งหมด
            </h2>

            {monthlyData.map((month) => (
                <div key={month.month} className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-medium text-gray-400">
                            {formatMonth(month.month)}
                        </h3>
                        <div className="flex gap-4 text-sm glass rounded-full">
                            <span className="text-green-400">
                                +฿{month.income.toLocaleString('th-TH')}
                            </span>
                            <span className="text-red-400">
                                -฿{month.expense.toLocaleString('th-TH')}
                            </span>
                        </div>
                    </div>


                    <div className="card p-0 overflow-hidden">
                        {month.transactions
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((transaction, index) => (
                                <div
                                    key={transaction.id}
                                    className={`transaction-item ${index !== month.transactions.length - 1 ? 'border-b border-white/5' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${transaction.type === 'income'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{transaction.description}</p>
                                            <p className="text-sm text-gray-500">
                                                {transaction.category} • {formatDate(transaction.date)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`font-semibold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                                                }`}
                                        >
                                            {transaction.type === 'income' ? '+' : '-'}฿
                                            {transaction.amount.toLocaleString('th-TH')}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(transaction.id, transaction.description)}
                                            className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
