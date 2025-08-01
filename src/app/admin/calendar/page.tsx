"use client"

import { useState } from 'react'
import DashboardLayout from '../../../components/ui/dashboard-layout'
import { adminNavigation } from '@/components/ui/admin-navigation'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';

// --- MOCK DATA ---
const MOCK_PROJECTS = [
    { id: 'p1', name: 'Refonte E-commerce', startDate: new Date(2025, 6, 8), endDate: new Date(2025, 7, 20), color: 'bg-blue-500' },
    { id: 'p2', name: 'Application Mobile Fitness', startDate: new Date(2025, 6, 15), endDate: new Date(2025, 8, 10), color: 'bg-green-500' },
    { id: 'p3', name: 'Migration Cloud AWS', startDate: new Date(2025, 7, 1), endDate: new Date(2025, 7, 30), color: 'bg-purple-500' },
];

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{format(currentMonth, 'MMMM yyyy', { locale: fr })}</h2>
            <div className="flex space-x-2">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-md hover:bg-gray-100"><ChevronLeft className="h-5 w-5" /></button>
                <button onClick={() => setCurrentMonth(new Date())} className="text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-100 border">Aujourd'hui</button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-md hover:bg-gray-100"><ChevronRight className="h-5 w-5" /></button>
            </div>
        </div>
    );

    const renderDays = () => {
        const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
        return (
            <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500">
                {days.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        
        return (
            <div className="grid grid-cols-7 grid-rows-5 gap-px bg-gray-200 border-t border-l border-gray-200">
                {days.map((day, i) => (
                    <div key={i} className={`relative p-2 bg-white h-32 ${!isSameMonth(day, monthStart) ? 'bg-gray-50' : ''}`}>
                        <time dateTime={format(day, 'yyyy-MM-dd')} className={`text-sm ${isToday(day) ? 'bg-indigo-600 text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>
                            {format(day, 'd')}
                        </time>
                        <div className="mt-1 space-y-1">
                            {MOCK_PROJECTS.filter(p => day >= p.startDate && day <= p.endDate)
                                .map(p => (
                                    <div key={p.id} className={`text-xs text-white rounded px-1 truncate ${p.color}`}>
                                        {p.name}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <DashboardLayout title="Calendrier des Projets" navigation={adminNavigation}>
            <div className="mt-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    {renderHeader()}
                    {renderDays()}
                    {renderCells()}
                </div>
            </div>
        </DashboardLayout>
    );
}
