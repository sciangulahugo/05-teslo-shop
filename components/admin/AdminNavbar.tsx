import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";
import { useContext } from "react";
import { UiContext } from "@/context";

export const AdminNavbar = () => {
    const { toggleSideMenu } = useContext(UiContext);

    return (
        <AppBar>
            <Toolbar>
                <Link display="flex" alignItems="center" underline="none" href="/" component={NextLink}>
                    <Typography variant="h6">Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>

                <Box flex={1} />

                <Button onClick={toggleSideMenu}>Menú</Button>
            </Toolbar>
        </AppBar>
    );
};
