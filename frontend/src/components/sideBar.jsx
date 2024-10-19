import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  List,
  CssBaseline,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import {
  HomeRounded,
  Person,
  HomeWorkRounded,
  MenuRounded,
  MenuOpenRounded,
  ContactSupportRounded,
  Kitchen,
  RateReviewRounded,
  MonetizationOn,
  HowToReg,
  MenuBook,
  Groups2,
  CalendarViewMonth,
  CalendarMonth,
} from "@mui/icons-material";
import { Button, Image } from "react-bootstrap";
import { setSideBarStatus } from "../slices/customizeSlice";

import sideBarStyles from "../styles/sideBarStyles.module.css";
import LogoBig from "/logoBig2.png";
import Logo from "/logo.png";
import { RiWaterFlashFill } from "react-icons/ri";
import { GiMeal } from "react-icons/gi";
import { LocalHospital } from "@mui/icons-material";
import { FolderShared } from "@mui/icons-material";
import EventAvailableRounded from "@mui/icons-material/EventAvailableRounded";
import ReorderIcon from "@mui/icons-material/Reorder";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  background: "#ffffff",
  color: "rgb(255, 249, 249)",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  background: "#ffffff",
  color: "rgb(255, 249, 249)",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 0),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  blackSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { sideBar } = useSelector((state) => state.customize);
  const { userInfo } = useSelector((state) => state.auth);

  const [open, setOpen] = React.useState(sideBar ? sideBar.status : false);

  const location = useLocation();
  const dispatch = useDispatch();
  const activeRoute = location.pathname;

  const handleDrawerOpen = () => {
    document.getElementById("logo").src = LogoBig;
    setOpen(true);
    dispatch(setSideBarStatus({ status: true }));
  };

  const handleDrawerClose = () => {
    document.getElementById("logo").src = Logo;
    setOpen(false);
    dispatch(setSideBarStatus({ status: false }));
  };

  React.useEffect(() => {
    setOpen(sideBar ? sideBar.status : false);
  }, [isSmallScreen]);

  return (
    <Box sx={{ display: "flex" }} id="sideBarBox">
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Link to="/">
            <Image src={open ? LogoBig : Logo} height="60px" id="logo" />
          </Link>
          {open ? (
            <div
              onClick={handleDrawerClose}
              className={sideBarStyles.closeMenuBtn}
            >
              <MenuOpenRounded />
            </div>
          ) : (
            <></>
          )}
        </DrawerHeader>
        <Divider />
        <List>
          <Link to="/" style={{ textDecoration: "none", color: "black" }}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <Tooltip title={!open ? "Home" : ""} placement="right" arrow>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  className={`${sideBarStyles.itmBtn}`}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "black",
                    }}
                  >
                    <HomeRounded />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Home"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </Link>

          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <Tooltip title={!open ? "Profile" : ""} placement="right" arrow>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "initial",
                    px: 2.5,
                  }}
                  className={`${sideBarStyles.itmBtn} ${
                    activeRoute === "/profile" ? sideBarStyles.active : ""
                  }`}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "black",
                    }}
                  >
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Profile"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </Link>
          <Link
            to="/health-card"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={!open ? "health-card" : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "initial",
                    px: 2.5,
                  }}
                  className={`${sideBarStyles.itmBtn} ${
                    activeRoute === "/health-card" ? sideBarStyles.active : ""
                  }`}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "black",
                    }}
                  >
                    <LocalHospital />
                  </ListItemIcon>
                  <ListItemText
                    primary={"health-card"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </Link>
          {/* <Link
            to="/medical-records"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={!open ? "medical-records" : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "initial",
                    px: 2.5,
                  }}
                  className={`${sideBarStyles.itmBtn} ${
                    activeRoute === "/medical-records"
                      ? sideBarStyles.active
                      : ""
                  }`}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "black",
                    }}
                  >
                    <FolderShared />
                  </ListItemIcon>
                  <ListItemText
                    primary={"medical-records"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </Link> */}

          <Link
            to="/prescriptions"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={!open ? "Prescriptions" : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "initial",
                    px: 2.5,
                  }}
                  className={`${sideBarStyles.itmBtn} ${
                    activeRoute === "/prescriptions" ? sideBarStyles.active : ""
                  }`}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "black",
                    }}
                  >
                    <ReorderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Prescriptions"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </Link>

          {userInfo.userType == "admin" ? ( //Navigations for Admin
            <>
              <Link
                to="/admin/boardings/"
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItem disablePadding sx={{ display: "block" }}>
                  <Tooltip
                    title={!open ? "Boardings" : ""}
                    placement="right"
                    arrow
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "initial",
                        px: 2.5,
                      }}
                      className={`${sideBarStyles.itmBtn} ${
                        activeRoute.startsWith("/admin/boardings")
                          ? sideBarStyles.active
                          : ""
                      }`}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "black",
                        }}
                      >
                        <HomeWorkRounded />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Boardings"}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              </Link>
            </>
          ) : (
            <></>
          )}

          {/* Manager Navigations */}
          {userInfo.userType == 'manager' ?
          <>
            <Link
              to="/staff/shifts"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                <Tooltip title={!open ? "Shifts" : ""} placement="right" arrow>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "initial",
                      px: 2.5,
                    }}
                    className={`${sideBarStyles.itmBtn} ${
                      activeRoute.startsWith("/staff/shifts")
                        ? sideBarStyles.active
                        : ""
                    }`}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "black",
                      }}
                    >
                      <Groups2 />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Shifts"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </Link>
          </>
          : <></>}

          {/* Manager Navigations */}
          {userInfo.userType == 'nurse' || userInfo.userType == 'trainee' ?
          <>
            <Link
              to="/my/shifts"
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                <Tooltip title={!open ? "My Shifts" : ""} placement="right" arrow>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "initial",
                      px: 2.5,
                    }}
                    className={`${sideBarStyles.itmBtn} ${
                      activeRoute.startsWith("/my/shifts")
                        ? sideBarStyles.active
                        : ""
                    }`}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: "black",
                      }}
                    >
                      <CalendarMonth />
                    </ListItemIcon>
                    <ListItemText
                      primary={"My Shifts"}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            </Link>
          </>
          : <></>}

          {/* doctor navigation */}
          {userInfo.userType == "doctor" ? (
          <Link
            to="/doctor/appointments"
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={!open ? "Doctor Appointments" : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "initial",
                    px: 2.5,
                  }}
                  className={`${sideBarStyles.itmBtn} ${
                    activeRoute.startsWith("/doctor/appointments")
                      ? sideBarStyles.active
                      : ""
                  }`}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: "black",
                    }}
                  >
                    <EventAvailableRounded />{" "}
                    {/* Replace with an appropriate icon for appointments */}
                  </ListItemIcon>
                  <ListItemText
                    primary={"Doctor Appointments"}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          </Link>
          ) : (
            <></>
          )}

          {/* doctor navigation */}
        </List>
      </Drawer>
      {open ? (
        <></>
      ) : (
        <div
          id="smMenuBtn"
          onClick={handleDrawerOpen}
          style={{ left: `calc(${theme.spacing(7)} + 9px)` }}
          className={sideBarStyles.openMenuBtn}
        >
          <MenuRounded />
        </div>
      )}
    </Box>
  );
}
