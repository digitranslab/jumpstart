import React from 'react';
import { useAppDataStore } from '@/_stores/appDataStore';
import JumpstartLogoIcon from '@/_ui/Icon/solidIcons/JumpstartLogoIcon';
import JumpstartLogoText from '@/_ui/Icon/solidIcons/JumpstartLogoText';
import { shallow } from 'zustand/shallow';

const JumpstartBanner = ({ isDarkMode }) => {
  const instanceId = useAppDataStore(
    (state) => ({
      instance_id: state.metadata?.instance_id,
    }),
    shallow
  );

  return (
    <div
      className="powered-with-tj"
      onClick={() => {
        const url = `https://jumpstart.com/?utm_source=powered_by_banner&utm_medium=${instanceId}&utm_campaign=self_hosted`;
        window.open(url, '_blank');
      }}
    >
      Built with
      <span className={'powered-with-tj-icon'}>
        <JumpstartLogoIcon />
      </span>
      <JumpstartLogoText fill={isDarkMode ? '#ECEDEE' : '#11181C'} />
    </div>
  );
};

export default JumpstartBanner;
