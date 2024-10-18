import { useCallback } from 'react';

import { DropdownSelect, Icon, Typography } from '@smar/ui';

import st from './styles.module.scss';

type MenuProps = {
  userName?: string;
  logout: () => void;
};

export const Menu = ({ userName, logout }: MenuProps) => {
  const UserItem = (
    <div className={`${st.dropDownItem} ${st.dropDownItemFirst}`}>
      <Icon name="my-account" size={24} iconFill="currentColor" mr={1} />
      <Typography variant="h150">{userName}</Typography>
    </div>
  );

  // const SettingsItem = (
  //   <div className={st.dropDownItem}>
  //     <Icon name="settings" size={24} iconFill="currentColor" mr={1} />
  //     <Typography variant="h150">Settings</Typography>
  //   </div>
  // );

  const LogoutItem = (
    <div className={st.dropDownItem} /*onClick={logout}*/>
      <Icon name="logout" size={24} iconFill="currentColor" mr={1} />
      <Typography variant="h150">Logout</Typography>
    </div>
  );

  const label = { option: UserItem, value: 'User' };

  const items = [
    { option: UserItem, value: 'User' },
    // { option: SettingsItem, value: 'Settings' },
    { option: LogoutItem, value: 'Log out', triggerEvent: logout },
  ];
  const handleSelectLogout = useCallback(
    ({ value }: { value: string }) => {
      if (value === 'Log out') {
        logout();
      }
    },
    [logout],
  );

  return (
    <div className={st.root}>
      <button className={st.iconWrapper}>
        <Icon name="shopping-cart" size={24} iconFill="secondaryDarkBlue920" />
      </button>
      <button className={st.iconWrapper}>
        <Icon name="notifications-none" size={24} iconFill="secondaryDarkBlue920" />
      </button>
      <DropdownSelect
        menuLabel={label}
        items={items}
        borderRadius={24}
        onSelect={handleSelectLogout as any}
      />
    </div>
  );
};
