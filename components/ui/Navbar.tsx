import { SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, Link, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";

export const Navbar = () => {
    return (
        <AppBar>
            <Toolbar>
                <Link display="flex" alignItems="center" underline="none" href="/" component={NextLink}>
                    <Typography variant="h6">Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>
                <Box flex={1} />
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    {/* <NextLink legacyBehavior href="/category/man">
                        <Link>
                            <Button>Hombres</Button>
                        </Link>
                    </NextLink> */}
                    <Link component={NextLink} href="/category/man">
                        <Button>Hombres</Button>
                    </Link>
                    <Link component={NextLink} href="/category/woman">
                        <Button>Mujeres</Button>
                    </Link>
                    <Link component={NextLink} href="/category/kid">
                        <Button>Niños</Button>
                    </Link>
                </Box>
                <Box flex={1} />
                <IconButton>
                    <SearchOutlined />
                </IconButton>
                <Link component={NextLink} href="/cart">
                    <IconButton>
                        <Badge badgeContent={2} color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
                <Button>Menú</Button>
            </Toolbar>
        </AppBar>
    );
};
