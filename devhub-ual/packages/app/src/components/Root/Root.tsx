import { PropsWithChildren } from 'react';
import { makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import CategoryIcon from '@material-ui/icons/Category';
import ExtensionIcon from '@material-ui/icons/Extension';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import StorageIcon from '@material-ui/icons/Storage';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import LayersIcon from '@material-ui/icons/Layers';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import GroupIcon from '@material-ui/icons/People';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarScrollWrapper,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import { MyGroupsSidebarItem } from '@backstage/plugin-org';
import { NotificationsSidebarItem } from '@backstage/plugin-notifications';

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    background: theme.palette.background.default,
  },
}));

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link to="/" underline="none" className={classes.link} aria-label="Home">
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => {
  const classes = useStyles();

  return (
    <SidebarPage>
      <div className={classes.root}>
        <Sidebar>
          <SidebarLogo />
          <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
            <SidebarSearchModal />
          </SidebarGroup>
          <SidebarDivider />
          <SidebarGroup label="Menu" icon={<MenuIcon />}>
            <SidebarItem icon={HomeIcon} to="/" text="Home" />
            <SidebarItem icon={CategoryIcon} to="catalog" text="Catalog" />
            <MyGroupsSidebarItem
              singularTitle="My Group"
              pluralTitle="My Groups"
              icon={GroupIcon}
            />
            <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
            <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
            <SidebarItem icon={CloudQueueIcon} to="airflow" text="Airflow" />
            <SidebarItem icon={StorageIcon} to="elasticsearch" text="Elasticsearch" />
            <SidebarItem icon={LibraryBooks} to="data-catalog" text="Data Catalog" />
            <SidebarItem icon={LayersIcon} to="openmetadata" text="OpenMetadata" />
            <SidebarItem icon={EqualizerIcon} to="kibana" text="Kibana" />
            <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." />
            <SidebarDivider />
            <SidebarScrollWrapper>
            </SidebarScrollWrapper>
          </SidebarGroup>
          <SidebarSpace />
          <SidebarDivider />
          <NotificationsSidebarItem />
          <SidebarDivider />
          <SidebarGroup
            label="Settings"
            icon={<UserSettingsSignInAvatar />}
            to="/settings"
          >
            <SidebarSettings />
          </SidebarGroup>
          <SidebarItem icon={ExitToAppIcon} to="/logout" text="Sign Out" />
        </Sidebar>
        <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
      </div>
    </SidebarPage>
  );
};
