const DashedBackground = () => {
    return (
        <div className="absolute min-h-screen w-full bg-background">
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(45deg, transparent 49%, oklch(0.75 0.15 75) 49%, oklch(0.75 0.15 75) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, oklch(0.60 0.10 75) 49%, oklch(0.60 0.10 75) 51%, transparent 51%)
          `,
                    backgroundSize: '40px 40px',
                    WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)',
                    maskImage: 'radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)',
                }}
            />
        </div>
    );
};

export default DashedBackground;
