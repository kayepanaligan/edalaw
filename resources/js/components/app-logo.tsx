export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md overflow-hidden">
                <img
                    src="/edalaw_logo.png"
                    alt="EDALaw Logo"
                    className="size-full object-contain"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    eDalaw+
                </span>
            </div>
        </>
    );
}
