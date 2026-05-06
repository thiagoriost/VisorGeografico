export const HomeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/>
    </svg>
)

export const ZoomInIcon = () => (
    <svg width="18" height="18">
        <path fill="currentColor" d="M15 10h-4V6h-2v4H5v2h4v4h2v-4h4z"/>
    </svg>
)

export const ZoomOutIcon = () => (
    <svg width="18" height="18">
        <path fill="currentColor" d="M5 11h10v2H5z"/>
    </svg>
)

export const LocationIcon = () => (
    <svg width="18" height="18">
        <path fill="currentColor" d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"/>
    </svg>
)

export const PrevIcon = () => (
    <svg width="18" height="18">
        <path fill="currentColor" d="M15 6l-6 6 6 6"/>
    </svg>
)

export const NextIcon = () => (
    <svg width="18" height="18">
        <path fill="currentColor" d="M9 6l6 6-6 6"/>
    </svg>
)

type LayersIconProps = {
    className?: string;
}

export const LayersIcon = ({ className }: LayersIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={className}
    >
        <path
            d="M12 4L4 8.5L12 13L20 8.5L12 4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
        <path
            d="M4 12.5L12 17L20 12.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4 16.5L12 21L20 16.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)