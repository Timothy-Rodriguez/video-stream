import React from 'react';
import {
  Grid,
  Box,
  Container,
  Button,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

// Pulse animation with white color (same as header)
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

const FooterButton = styled(Button)({
  color: '#fff',
  backgroundColor: '#1976d2',
  borderRadius: '20px',
  padding: '10px 20px',
  '&:hover': {
    backgroundColor: '#2196f3',
    animation: `${pulse} 1.5s infinite`,
  },
});

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#1976d2', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} sm={3}>
            <FooterButton fullWidth>Products</FooterButton>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FooterButton fullWidth>Company</FooterButton>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FooterButton fullWidth>Support</FooterButton>
          </Grid>
          <Grid item xs={6} sm={3}>
            <FooterButton fullWidth>Contact</FooterButton>
          </Grid>
        </Grid>
        <Typography 
          variant="body2" 
          color="white" 
          align="center" 
          sx={{ mt: 3, opacity: 0.8 }}
        >
          © {new Date().getFullYear()} MyApp. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;