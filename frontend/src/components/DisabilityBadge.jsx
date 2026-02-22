import { cn } from '../lib/utils';

const categoryStyles = {
    physical: {
        bg: 'bg-[#FF5C5C]/20',
        text: 'text-[#FF5C5C]',
        border: 'border-[#FF5C5C]/30',
        label: 'Physical'
    },
    cognitive: {
        bg: 'bg-[#FFD700]/20',
        text: 'text-[#FFD700]',
        border: 'border-[#FFD700]/30',
        label: 'Cognitive'
    },
    invisible: {
        bg: 'bg-[#F4F4F5]/20',
        text: 'text-[#F4F4F5]',
        border: 'border-[#F4F4F5]/30',
        label: 'Invisible'
    },
    psychiatric: {
        bg: 'bg-[#38BDF8]/20',
        text: 'text-[#38BDF8]',
        border: 'border-[#38BDF8]/30',
        label: 'Psychiatric'
    },
    sensory: {
        bg: 'bg-[#34D399]/20',
        text: 'text-[#34D399]',
        border: 'border-[#34D399]/30',
        label: 'Sensory'
    },
    multiple: {
        bg: 'bg-white/10',
        text: 'text-white',
        border: 'border-white/20',
        label: 'Multiple'
    },
    prefer_not_to_say: {
        bg: 'bg-zinc-500/20',
        text: 'text-zinc-400',
        border: 'border-zinc-500/30',
        label: 'Prefer not to say'
    }
};

export const DisabilityBadge = ({ category, size = 'default', className }) => {
    const style = categoryStyles[category] || categoryStyles.prefer_not_to_say;
    
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border font-medium',
                style.bg,
                style.text,
                style.border,
                size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
                className
            )}
            data-testid={`badge-${category}`}
        >
            {style.label}
        </span>
    );
};

export const getCategoryColor = (category) => {
    const colors = {
        physical: '#FF5C5C',
        cognitive: '#FFD700',
        invisible: '#F4F4F5',
        psychiatric: '#38BDF8',
        sensory: '#34D399'
    };
    return colors[category] || '#A1A1AA';
};

export default DisabilityBadge;
