
import React from 'react';
import { Box, Grid } from '@mui/material';

function MainAuthCard({ leftContent, rightContent }) {
  return (
    <Grid
      container
      sx={{
        maxWidth: {xs:400,md:920},
        width: "100%",
        // border:'2px solid red',
        // borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0px 15px 35px rgba(30, 17, 84, 0.18)",
        //bgcolor:'pink', 
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      {/* Left Column */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
           // minHeight:{xs:200,md:520},
            width: "100%",
             p: { xs: 4, md: 6 },
            background: 'linear-gradient(135deg, #3B66F5 0%, #4A26E1 55%, #1E1154 100%)',
            color: "white",
            position: "relative",
          }}
        >
          {leftContent}
        </Box>
      </Grid>

      {/* Right Column */}
      <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex" }}>
        <Box
          sx={{
            flex: 1,
          //  minHeight:{xs:'auto',md:520},
            width: "100%",
            p: { xs: 2, md: 4 },
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {rightContent}
        </Box>
      </Grid>
    </Grid>
  );
}

export default MainAuthCard;