import type { FC } from 'react';

const TrustLogos: FC = () => {
  return (
    <div className="bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <h3 className="text-center text-lg font-bold text-slate-400 uppercase tracking-wider mb-6">
          موثوق به من قبل
        </h3>
        <div className="flex justify-center items-center space-x-8 space-x-reverse">
          <div className="flex items-center">
            <img
                loading="lazy"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Flag_of_Iraq.svg/320px-Flag_of_Iraq.svg.png"
                alt="IHEC Logo"
                width={320}
                height={213}
                className="h-8 w-auto"
            />
            <span className="font-bold text-slate-200 mr-2">IHEC Data Partner</span>
          </div>
          <div className="flex items-center grayscale opacity-75">
             <img
                loading="lazy"
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/United_Nations_logo_logotype.svg"
                alt="United Nations"
                width={512}
                height={512}
                className="h-8 w-auto invert"
            />
          </div>
          <div className="flex items-center grayscale opacity-75">
             <img
                loading="lazy"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/International_Foundation_for_Electoral_Systems_logo.svg/512px-International_Foundation_for_Electoral_Systems_logo.svg.png"
                alt="IFES"
                width={512}
                height={512}
                className="h-10 w-auto invert"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustLogos;
