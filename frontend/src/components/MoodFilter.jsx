import {
    AlertCircle,
    CloudRain,
    Flame,
    Heart,
    HeartCrack,
    Laugh,
    Palette,
    Smile,
    Sparkles,
    Target,
} from 'lucide-react';

const MoodFilter = ({ selectedMood, onMoodChange }) => {
    const moods = [
        { name: 'All', icon: Sparkles, color: 'gray' },
        { name: 'Inspired', icon: Sparkles, color: 'blue' },
        { name: 'Joyful', icon: Smile, color: 'yellow' },
        { name: 'Grateful', icon: Heart, color: 'green' },
        { name: 'Romantic', icon: Flame, color: 'red' },
        { name: 'Heartbroken', icon: HeartCrack, color: 'slate' },
        { name: 'Lonely', icon: CloudRain, color: 'indigo' },
        { name: 'Creative', icon: Palette, color: 'purple' },
        { name: 'Motivated', icon: Target, color: 'orange' },
        { name: 'Anxious', icon: AlertCircle, color: 'violet' },
        { name: 'Funny', icon: Laugh, color: 'lime' },
    ];

    return (
        // Removed sticky classes, made component part of the scroll flow
        <div className="mb-8 bg-[#0a0e27] pt-4 border-b border-gray-800">
            <h2 className="text-white text-xl font-semibold mb-4 text-center">
                How are you feeling?
            </h2>
            {/* Added wrapper for horizontal scrolling on mobile */}
            <div className="overflow-x-auto pb-4">
                <div className="inline-flex space-x-3 px-4 sm:px-0 sm:justify-center sm:w-full">
                    {moods.map((mood) => {
                        const Icon = mood.icon;
                        const isSelected = selectedMood === mood.name;

                        return (
                            <button
                                key={mood.name}
                                onClick={() => onMoodChange(mood.name)}
                                className={`
                                flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full
                                transition-all duration-200 font-medium
                                ${
                                    isSelected
                                        ? 'bg-[#ec4899] text-white scale-105 shadow-lg'
                                        : 'bg-[#1a1f3a] text-gray-400 hover:bg-[#252a47] hover:text-white'
                                }
                            `}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{mood.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MoodFilter;
