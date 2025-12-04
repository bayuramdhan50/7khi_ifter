import { Activity } from '../types/types';

interface ActivityTabsProps {
    activities: Activity[];
    selectedActivity: number;
    onSelectActivity: (activityId: number) => void;
}

export default function ActivityTabs({ activities, selectedActivity, onSelectActivity }: ActivityTabsProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-700">Kategori:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
                {activities.map((activity) => (
                    <button
                        key={activity.id}
                        onClick={() => onSelectActivity(activity.id)}
                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                            selectedActivity === activity.id
                                ? `${activity.color} text-white`
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        <span className="text-lg">{activity.icon}</span>
                        {activity.title}
                    </button>
                ))}
            </div>
        </div>
    );
}
