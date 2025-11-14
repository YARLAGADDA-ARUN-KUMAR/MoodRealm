import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const getMoodColor = (mood) => {
    const colors = {
        Inspired: 'from-blue-500 to-purple-600',
        Joyful: 'from-yellow-400 to-orange-500',
        Grateful: 'from-green-400 to-teal-500',
        Romantic: 'from-pink-500 to-red-500',
        Heartbroken: 'from-gray-500 to-blue-900',
        Lonely: 'from-indigo-900 to-gray-800',
        Creative: 'from-purple-500 to-pink-500',
        Motivated: 'from-orange-500 to-red-600',
        Anxious: 'from-gray-600 to-purple-900',
        Funny: 'from-yellow-300 to-green-400',
        Neutral: 'from-gray-600 to-gray-800',
    };
    return colors[mood] || colors.Neutral;
};
