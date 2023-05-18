import { useRouter } from "next/router";
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";
import { useContext, useState } from "react";
import { UiContext } from "@/context";

export const Navbar = () => {
    const { asPath, push } = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`);
    };

    // console.log(asPath);
    return (
        <AppBar>
            <Toolbar>
                <Link display="flex" alignItems="center" underline="none" href="/" component={NextLink}>
                    <Typography variant="h6">Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>
                <Box flex={1} />
                <Box
                    sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'flex' } }}
                    className="fadeIn"
                >
                    {/* <NextLink legacyBehavior href="/category/man">
                        <Link>
                            <Button>Hombres</Button>
                        </Link>
                    </NextLink> */}
                    <Link component={NextLink} href="/category/men">
                        <Button color={asPath === "/category/men" ? "primary" : "info"}>Hombres</Button>
                    </Link>
                    <Link component={NextLink} href="/category/women">
                        <Button color={asPath === "/category/women" ? "primary" : "info"}>Mujeres</Button>
                    </Link>
                    <Link component={NextLink} href="/category/kid">
                        <Button color={asPath === "/category/kid" ? "primary" : "info"}>Niños</Button>
                    </Link>
                </Box>
                <Box flex={1} />

                {/* Pantallas grandes */}
                {
                    isSearchVisible
                        ? (
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex  ' } }}
                                className="fadeIn"
                                autoFocus
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                // onKeyDown={(e) => e.key === 'Enter' && onSearchTerm()}
                                onKeyUp={(e) => e.key === 'Enter' && onSearchTerm()}
                                type='text'
                                placeholder="Buscar..."
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => { setIsSearchVisible(false); }}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                className="fadeIn"
                                onClick={() => setIsSearchVisible(true)}
                                sx={{ display: { xs: "none", sm: "flex" } }}

                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }

                {/* Pantallas chicas */}
                <IconButton
                    sx={{ display: { xs: "", sm: "none" } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <Link component={NextLink} href="/cart">
                    <IconButton>
                        <Badge badgeContent={2} color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
                <Button onClick={toggleSideMenu}>Menú</Button>
            </Toolbar>
        </AppBar>
    );
};
