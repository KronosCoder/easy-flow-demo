'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* Demo user for testing */
const DEMO_USER: User = {
    id: '1',
    email: 'demo@budgetflow.com',
    name: 'ผู้ใช้ทดสอบ',
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        // check for existing token on mount
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setState({
                user: JSON.parse(savedUser),
                isAuthenticated: true,
                isLoading: false,
            });
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // demo authentication (accept any non-empty credentials)
        if (email && password) {
            const user = { ...DEMO_USER, email, name: email.split('@')[0] };
            localStorage.setItem('auth_token', 'demo_token_' + Date.now());
            localStorage.setItem('user', JSON.stringify(user));

            setState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
