const SiteLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className=" m-auto max-w-[1300px] min-h-screen max-h-max md:max-h-screen bg-white">
            {children}
        </div>
    );
};

export default SiteLayout;
