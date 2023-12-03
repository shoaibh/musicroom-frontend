const SiteLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className=" m-auto max-w-[1200px] min-h-screen max-h-max md:max-h-screen bg-white">
            {children}
        </div>
    );
};

export default SiteLayout;
