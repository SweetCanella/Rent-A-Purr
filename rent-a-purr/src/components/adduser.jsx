import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Lock } from 'lucide-react';

export default function AddUser({ onClose, onSubmit }) {
    const[formData, setFormData] = useState({ username: '', password: '', nickname: '', phone: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-m3">
            <div className="bg-white rounded-[32px] w-full max-w-sm shadow-2xl border-2 border-[#00C4D1]/20 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b-2 border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Новый юзер</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><X size={24} strokeWidth={2.5} /></button>
                </div>
                <div className="p-8 overflow-y-auto no-scrollbar">
                    <form id="add-user-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-extrabold text-slate-700 ml-1 uppercase flex items-center gap-2"><User size={16} className="text-[#00C4D1]"/> Логин</label>
                            <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#00C4D1] outline-none font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-extrabold text-slate-700 ml-1 uppercase flex items-center gap-2"><Lock size={16} className="text-[#7838F5]"/> Пароль</label>
                            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#00C4D1] outline-none font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-extrabold text-slate-700 ml-1 uppercase flex items-center gap-2"><User size={16} className="text-[#F6828C]"/> Имя (Никнейм)</label>
                            <input required value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#00C4D1] outline-none font-bold" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-extrabold text-slate-700 ml-1 uppercase flex items-center gap-2"><Phone size={16} className="text-[#FF6B00]"/> Телефон</label>
                            <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-[#00C4D1] outline-none font-bold" />
                        </div>
                    </form>
                </div>
                <div className="px-8 py-5 border-t-2 border-slate-100 bg-white flex justify-end gap-3 rounded-b-[32px]">
                    <button type="button" onClick={onClose} className="px-6 py-3.5 rounded-2xl text-slate-500 font-extrabold hover:bg-slate-100">Отмена</button>
                    <button form="add-user-form" type="submit" className="px-8 py-3.5 rounded-2xl bg-[#00C4D1] hover:bg-[#00A8B3] text-white font-extrabold shadow-lg shadow-[#00C4D1]/30">Создать</button>
                </div>
            </div>
        </div>,
        document.body
    );
}