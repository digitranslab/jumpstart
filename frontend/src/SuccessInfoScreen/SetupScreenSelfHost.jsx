import React, { useState, useEffect } from 'react';
import EnterIcon from '../../assets/images/onboardingassets/Icons/Enter';
import { ButtonSolid } from '@/_components/AppButton';
import OnbboardingFromSH from '../OnBoardingForm/OnbboardingFromSH';
import LogoLightMode from '@assets/images/Logomark.svg';
import LogoDarkMode from '@assets/images/Logomark-dark-mode.svg';

function SetupScreenSelfHost({ darkMode }) {
  const [showSelfHostOboarding, setShowSelfHostOboarding] = useState(false);
  const Logo = darkMode ? LogoDarkMode : LogoLightMode;

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === 'Enter') {
        setShowSelfHostOboarding(true);
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  return (
    <div className="sh-setup-screen-wrapper">
      {!showSelfHostOboarding ? (
        <div className="sh-setup-banner">
          <div className="onboarding-navbar onboarding-navbar-layout setup-page-navbar">
            <div className="jumpstart-nav-logo">
              <Logo height="23" width="92" alt="jumpstart logo" data-cy="page-logo" />
            </div>
          </div>
          {/* placeholders for image */}
          <div className="sh-setup-banner-inner" data-cy="setup-banner-inner"></div>
          <div className="sh-setup-sub-banner" data-cy="setup-sub-banner"></div>
          <div className="sh-setup-card" data-cy="setup-card">
            <img
              src="assets/images/onboardingassets/Illustrations/Dots.svg"
              alt="jumpstart onboarding"
              loading="lazy"
              data-cy="setup-card-image"
            />
            <h1 data-cy="setup-card-header">
              Hello,
              <br /> Welcome to <br />
              <span>JumpStart!</span>
            </h1>
            <p data-cy="setup-card-sub-header">Let’s set up your workspace to get started with JumpStart</p>
            <ButtonSolid
              className="sh-setup-button"
              onClick={() => setShowSelfHostOboarding(true)}
              data-cy="setup-jumpstart-button"
            >
              <span>Set up JumpStart</span>
              <EnterIcon className="enter-icon-onboard" fill={'#fff'} />
            </ButtonSolid>
          </div>
        </div>
      ) : (
        <OnbboardingFromSH darkMode={darkMode} />
      )}
    </div>
  );
}

export default SetupScreenSelfHost;
