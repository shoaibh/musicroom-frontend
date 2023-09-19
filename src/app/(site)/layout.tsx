const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" m-auto max-w-[500px] min-h-[100vh] bg-gray-100">
      {children}
    </div>
  );
};

export default SiteLayout;
