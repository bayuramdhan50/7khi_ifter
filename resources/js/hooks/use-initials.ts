// Simple hook to get initials from a name string
export function useInitials() {
    return (name: string) => {
        if (!name) return '';
        const words = name.trim().split(' ');
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        return (
            words[0].charAt(0) +
            (words[1] ? words[1].charAt(0) : '')
        ).toUpperCase();
    };
}
