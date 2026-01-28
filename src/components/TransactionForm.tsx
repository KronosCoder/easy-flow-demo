'use client';

import { useState, useEffect, useRef } from 'react';
import { useBudget } from '@/context/BudgetContext';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';
import { animateModalIn, animateModalOut } from '@/lib/animations';
import Swal from 'sweetalert2';

interface TransactionFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TransactionForm({ isOpen, onClose }: TransactionFormProps) {
    const { addTransaction } = useBudget();
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        type: 'expense' as 'income' | 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            animateModalIn(overlayRef.current, contentRef.current);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        // Reset category when type changes
        setFormData(prev => ({ ...prev, category: '' }));
    }, [formData.type]);

    const handleClose = async () => {
        await animateModalOut(overlayRef.current, contentRef.current);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || !formData.category || !formData.description) {
            Swal.fire({
                icon: 'error',
                title: 'ข้อมูลไม่ครบ',
                text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
                background: '#1a1a2e',
                color: '#f8fafc',
                confirmButtonColor: '#6366f1',
                customClass: {
                    popup: 'rounded-2xl border border-white/10',
                },
            });
            return;
        }

        addTransaction({
            type: formData.type,
            amount: parseFloat(formData.amount),
            category: formData.category,
            description: formData.description,
            date: new Date(formData.date).toISOString(),
        });

        Swal.fire({
            icon: 'success',
            title: 'บันทึกสำเร็จ!',
            text: `เพิ่ม${formData.type === 'income' ? 'รายรับ' : 'รายจ่าย'}เรียบร้อยแล้ว`,
            timer: 1500,
            showConfirmButton: false,
            background: '#1a1a2e',
            color: '#f8fafc',
            customClass: {
                popup: 'rounded-2xl border border-white/10',
            },
        });

        // Reset form
        setFormData({
            type: 'expense',
            amount: '',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });

        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div ref={overlayRef} className="modal-overlay" onClick={handleClose}>
            <div
                ref={contentRef}
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">เพิ่มรายการใหม่</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Type Toggle */}
                    <div>
                        <label className="label">ประเภท</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                                className={`py-3 rounded-xl font-medium transition-all ${formData.type === 'income'
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/30'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                รายรับ
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                                className={`py-3 rounded-xl font-medium transition-all ${formData.type === 'expense'
                                        ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                รายจ่าย
                            </button>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="label">จำนวนเงิน (บาท)</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="0.00"
                            className="input text-2xl font-semibold"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="label">หมวดหมู่</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="select"
                        >
                            <option value="">เลือกหมวดหมู่</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="label">รายละเอียด</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="เช่น ค่าอาหารกลางวัน"
                            className="input"
                        />
                    </div>

                    {/* Date */}
                    <div>
                        <label className="label">วันที่</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                            className="input"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all ${formData.type === 'income'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:shadow-lg hover:shadow-green-500/30'
                                : 'bg-gradient-to-r from-red-500 to-rose-500 hover:shadow-lg hover:shadow-red-500/30'
                            }`}
                    >
                        บันทึกรายการ
                    </button>
                </form>
            </div>
        </div>
    );
}
