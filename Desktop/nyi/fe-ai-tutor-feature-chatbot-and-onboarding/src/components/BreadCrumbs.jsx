/* eslint-disable react/prop-types */
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink } from 'react-router';

const BreadCrumbs = ({ breadcrumbs }) => {

    return (
        <Box mb={2}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbs.map((item, index) =>
                    item.link ? (
                        <Link
                            key={index}
                            component={RouterLink}
                            to={item.link}
                            sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'none' } }}
                        >
                            {item.text}
                        </Link>
                    ) : (
                        <Typography key={index} sx={{ color: 'text.primary', display: 'flex', alignItems: 'center' }} >
                            {item.text} {breadcrumbs.length == 1 && <NavigateNextIcon fontSize="small" sx={{ml: 1 }} />}
                        </Typography>
                    )
                )}
            </Breadcrumbs>
        </Box>
    );
};

export default BreadCrumbs;
