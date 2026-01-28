'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fadeIn, formCardAnimation } from '@/lib/animations';
import Swal from 'sweetalert2';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading } = useAuth();
    const containerRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (containerRef.current) {
            formCardAnimation(containerRef.current, 0.2);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกข้อมูล',
                text: 'กรุณากรอกอีเมลและรหัสผ่าน',
                background: '#1a1a2e',
                color: '#f8fafc',
                confirmButtonColor: '#6366f1',
                customClass: {
                    popup: 'rounded-2xl border border-white/10',
                },
            });
            return;
        }

        setIsSubmitting(true);

        const success = await login(email, password);

        if (success) {
            Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบสำเร็จ!',
                text: 'ยินดีต้อนรับเข้าสู่ BudgetFlow',
                timer: 1500,
                showConfirmButton: false,
                background: '#1a1a2e',
                color: '#f8fafc',
                customClass: {
                    popup: 'rounded-2xl border border-white/10',
                },
            }).then(() => {
                router.push('/dashboard');
            });
        } else {
            setIsSubmitting(false);
            Swal.fire({
                icon: 'error',
                title: 'เข้าสู่ระบบไม่สำเร็จ',
                text: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
                background: '#1a1a2e',
                color: '#f8fafc',
                confirmButtonColor: '#6366f1',
                customClass: {
                    popup: 'rounded-2xl border border-white/10',
                },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            <div ref={containerRef} className="w-full glass-strong max-w-md h-auto relative !p-8 flex flex-col gap-4">
                {/* Logo */}
                <div className="text-center mb-8 form-item w-full">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        BudgetFlow
                    </h1>
                    <p className="text-gray-400 mt-2">จัดการเงินอย่างชาญฉลาด</p>
                </div>

                {/* Login Form */}
                <h2 className="text-xl font-semibold text-center mb-4">เข้าสู่ระบบ</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="mb-3">
                        <label className="label">อีเมล</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="input"
                            autoComplete="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="label">รหัสผ่าน</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input"
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn btn-primary py-4 text-lg mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                กำลังเข้าสู่ระบบ...
                            </span>
                        ) : (
                            'เข้าสู่ระบบ'
                        )}
                    </button>
                </form>

                {/* Demo credentials hint */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-gray-400 text-center flex items-center justify-center gap-2">
                        💡 <span className="text-gray-300">ยังไม่มีบัญชี?</span>
                        <a href="/auth/register" className="text-primary">สมัครสมาชิก</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
