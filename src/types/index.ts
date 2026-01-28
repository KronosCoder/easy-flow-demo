// Type definitions for Budget Flow application

export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string; // ISO date string
    createdAt: string;
}

export interface MonthlyData {
    month: string; // Format: "YYYY-MM"
    income: number;
    expense: number;
    transactions: Transaction[];
}

export interface BudgetState {
    transactions: Transaction[];
    isLoading: boolean;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Category options for transactions
export const INCOME_CATEGORIES = [
    'เงินเดือน',
    'โบนัส',
    'งานเสริม',
    'ลงทุน',
    'อื่นๆ',
] as const;

export const EXPENSE_CATEGORIES = [
    'อาหาร',
    'เดินทาง',
    'ที่พัก',
    'สาธารณูปโภค',
    'ช้อปปิ้ง',
    'สุขภาพ',
    'บันเทิง',
    'การศึกษา',
    'อื่นๆ',
] as const;

export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
