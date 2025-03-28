
export default function Badge({type, message}) {
    return (
        <span
            className={
                type === "success" ? "inline-flex items-center justify-center rounded-full bg-[#50c87854] px-2.5 py-0.5 text-[#29663d]"
                    : type === "warning" ? "inline-flex items-center justify-center rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-700"
                        : "inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-0.5 text-red-700"
            }
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="-ms-1 me-1.5 size-4"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={
                        type === "success" ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            : type === "warning" ? "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                : "M6 18L18 6M6 6l12 12"
                    }
                />
            </svg>

            <p className="whitespace-nowrap text-sm">{message}</p>
        </span>
    )
}
