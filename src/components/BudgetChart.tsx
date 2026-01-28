'use client';

import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useBudget } from '@/context/BudgetContext';
import { animateChart } from '@/lib/animations';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function BudgetChart() {
    const { transactions, getCurrentMonthData } = useBudget();
    const chartRef = useRef<HTMLDivElement>(null);

    const currentMonth = getCurrentMonthData();

    useEffect(() => {
        if (chartRef.current) {
            animateChart(chartRef.current, 0.3);
        }
    }, []);

    // Group expenses by category for the current month
    const expensesByCategory = currentMonth?.transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {} as Record<string, number>) || {};

    const categoryLabels = Object.keys(expensesByCategory);
    const categoryValues = Object.values(expensesByCategory);

    // Beautiful color palette
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#f5576c',
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#fa709a', '#fee140'
    ];

    const doughnutData = {
        labels: categoryLabels.length > 0 ? categoryLabels : ['ยังไม่มีข้อมูล'],
        datasets: [
            {
                data: categoryValues.length > 0 ? categoryValues : [1],
                backgroundColor: categoryValues.length > 0 ? colors.slice(0, categoryLabels.length) : ['#374151'],
                borderColor: 'transparent',
                borderWidth: 0,
                hoverOffset: 10,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#94a3b8',
                    font: {
                        family: 'Prompt',
                        size: 12,
                    },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                titleFont: { family: 'Prompt', size: 14 },
                bodyFont: { family: 'Prompt', size: 13 },
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: function (context: any) {
                        return `${context.label}: ฿${context.parsed.toLocaleString('th-TH')}`;
                    }
                }
            },
        },
    };

    // Monthly comparison data (last 6 months)
    const getLastSixMonths = () => {
        const months = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({
                key: date.toISOString().substring(0, 7),
                label: date.toLocaleDateString('th-TH', { month: 'short' }),
            });
        }
        return months;
    };

    const lastSixMonths = getLastSixMonths();

    const monthlyData = lastSixMonths.map(month => {
        const monthTransactions = transactions.filter(
            t => t.date.substring(0, 7) === month.key
        );
        return {
            income: monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
            expense: monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        };
    });

    const barData = {
        labels: lastSixMonths.map(m => m.label),
        datasets: [
            {
                label: 'รายรับ',
                data: monthlyData.map(d => d.income),
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'รายจ่าย',
                data: monthlyData.map(d => d.expense),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Prompt', size: 12 },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                titleFont: { family: 'Prompt', size: 14 },
                bodyFont: { family: 'Prompt', size: 13 },
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: function (context: any) {
                        return `${context.dataset.label || ''}: ฿${context.parsed.y.toLocaleString('th-TH')}`;
                    }
                }
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8', font: { family: 'Prompt' } },
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: {
                    color: '#94a3b8',
                    font: { family: 'Prompt' },
                    callback: function (value: any) {
                        return `฿${Number(value).toLocaleString('th-TH')}`;
                    }
                },
            },
        },
    };

    return (
        <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Expense Breakdown */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">
                    สัดส่วนรายจ่ายประจำเดือน
                </h3>
                <div className="h-72">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
            </div>

            {/* Monthly Comparison */}
            <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-gray-300">
                    เปรียบเทียบรายเดือน
                </h3>
                <div className="h-72">
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>
        </div>
    );
}
