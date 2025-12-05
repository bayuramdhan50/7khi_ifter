import { DashboardCard } from '../types';

interface StatCardProps {
    card: DashboardCard;
}

export default function StatCard({ card }: StatCardProps) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="mb-1 text-sm text-gray-600">{card.title}</p>
                    <p className={`text-3xl font-bold ${card.textColor}`}>
                        {card.value}
                    </p>
                </div>
                <div className={`${card.color} rounded-lg p-3`}>
                    <card.icon className="h-8 w-8 text-white" />
                </div>
            </div>
        </div>
    );
}
