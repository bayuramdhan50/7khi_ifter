interface QuickActionCardProps {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    colorScheme: 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
    blue: {
        border: 'hover:border-blue-500',
        bg: 'hover:bg-blue-50',
        iconBg: 'bg-blue-100 group-hover:bg-blue-200',
        iconColor: 'text-blue-600',
    },
    green: {
        border: 'hover:border-green-500',
        bg: 'hover:bg-green-50',
        iconBg: 'bg-green-100 group-hover:bg-green-200',
        iconColor: 'text-green-600',
    },
    orange: {
        border: 'hover:border-orange-500',
        bg: 'hover:bg-orange-50',
        iconBg: 'bg-orange-100 group-hover:bg-orange-200',
        iconColor: 'text-orange-600',
    },
    purple: {
        border: 'hover:border-purple-500',
        bg: 'hover:bg-purple-50',
        iconBg: 'bg-purple-100 group-hover:bg-purple-200',
        iconColor: 'text-purple-600',
    },
};

export default function QuickActionCard({
    href,
    icon: Icon,
    title,
    description,
    colorScheme,
}: QuickActionCardProps) {
    const colors = colorClasses[colorScheme];

    return (
        <a
            href={href}
            className={`rounded-lg border-2 border-gray-200 p-4 ${colors.border} ${colors.bg} group transition-all`}
        >
            <div className="flex items-center gap-3">
                <div className={`${colors.iconBg} rounded-lg p-2`}>
                    <Icon className={`h-6 w-6 ${colors.iconColor}`} />
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{title}</p>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </a>
    );
}
