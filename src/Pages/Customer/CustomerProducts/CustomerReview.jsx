// import React, { useEffect, useState } from 'react'
// import api from '../../../api/axiosConfig'
// import { Box, Typography } from '@mui/material';

// function CustomerReview() {

//     const [reviews,setReview] =useState([
//         {name:'abcd',url:"http:sfdsf.jpg",date:'10/05/2026',rating:'4.5',comment:'very good '},
//         {name:'abcd',url:"http:sfdsf.jpg",date:'10/05/2026',rating:'4.5',comment:'very good '},
//         {name:'abcd',url:"http:sfdsf.jpg",date:'10/05/2026',rating:'4.5',comment:'very good '},
//         {name:'abcd',url:"http:sfdsf.jpg",date:'10/05/2026',rating:'4.5',comment:'very good '},
//     ])

//     // async function getReview() {
    
//     //     let response = await api.get('/customer/review')
//     //     console.log("review data",response.data);
//     //     setReview(response.data || reviews)

//     // }

//     // useEffect(()=>{
//     //     getReview();
//     // },[])

//   return (
//     <Box>
//         <h1>Welcome to review</h1>
//         {reviews.map((item)=>{
//             <Box>
//                 <Typography>
//                     {item.url} + {item.name} +{item.date} 
//                 </Typography>
//                 <Typography>
//                     {item.rating}+{item.comment}
//                 </Typography>
//             </Box>
//         })}

//     </Box>
//   )
// }

// export default CustomerReview


import React, { useEffect, useState } from 'react';
import api from '../../../api/axiosConfig';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar, 
  Rating, 
  Stack 
} from '@mui/material';
import Grid from '@mui/material/Grid'; // Using MUI's latest responsive Grid

function CustomerReview(props) {
  const {id}= props;
  // Customized default mock data for PowerBites (Nutritious Food Brand)
  const [reviews, setReview] = useState([
    { 
      name: 'Sarah Jenkins', 
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", 
      date: '12/05/2026', 
      rating: 5.0, 
      comment: 'PowerBites are a total game-changer for my busy mornings! They taste amazing, fill me up completely, and give me sustained energy without the sugar crash.' 
    },
    { 
      name: 'Marcus Chen', 
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", 
      date: '14/05/2026', 
      rating: 4.5, 
      comment: 'Perfect post-workout fuel! It is incredibly hard to find clean, high-protein snacks that actually taste this good. The peanut butter crunch is my absolute favorite.' 
    },
    { 
      name: 'Elena Rostova', 
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", 
      date: '18/05/2026', 
      rating: 5.0, 
      comment: 'As a nutritionist, I highly approve of the ingredient list. No fillers, just real whole foods. Plus, my kids think they are eating dessert!' 
    },
    { 
      name: 'David Miller', 
      url: "", // Testing fallback to first letter 'D'
      date: '20/05/2026', 
      rating: 4.0, 
      comment: 'Great healthy alternative to sugary granola bars. Perfect for keeping in my office desk drawer when the 3 PM cravings hit.' 
    },
  ]);

  async function getReview() {
    try {
      let response = await api.get('/customer/review');
      if (response.data && response.data.length > 0) {
        const formattedData = response.data.map(item => ({
          ...item,
          rating: parseFloat(item.rating) || 0
        }));
        setReview(formattedData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  useEffect(() => {
    getReview();
  }, []);

  return (
    <Box sx={{ p: { xs: 2 }, maxWidth: '1200px', mt: 3 }}>
      
      {/* Header Section themed for PowerBites */}
      {/* <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 800, 
            fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
            color: '#2E7D32', // Nutritious healthy green color
            mb: 1,
            letterSpacing: '-0.5px'
          }}
        >
          Loved by PowerBites Lovers
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 400, 
            fontSize: { xs: '1rem', sm: '1.2rem' },
            color: 'text.secondary' 
          }}
        >
          See how our clean, nutritious energy bites are fueling everyday lives.
        </Typography>
      </Box> */}

      {/* Responsive Grid System: Stacks on mobile, splits into 2 on tablet, splits into 3 on desktop */}
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {reviews.map((item, index) => (
          <Grid size={{ xs: 12}} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 4, // Softer, more modern rounded corners
                border: '1px solid #E8F5E9', // Soft light green border hint
                boxShadow: '0px 4px 20px rgba(46, 125, 50, 0.03)', // Subtle healthy tinted shadow
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0px 12px 24px rgba(46, 125, 50, 0.08)',
                  borderColor: '#A5D6A7' // Highlights border color on hover
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                
                {/* User Header Info */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Avatar 
                    src={item.url} 
                    alt={item.name} 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: '#4CAF50', // Nutritious theme colored avatar background fallback
                      fontWeight: 600 
                    }}
                  >
                    {item.name ? item.name.charAt(0).toUpperCase() : 'P'}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#1B5E20' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Verified Buyer • {item.date}
                    </Typography>
                  </Box>
                </Stack>

                {/* Rating Component */}
                <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Rating 
                    value={parseFloat(item.rating)} 
                    precision={0.5} 
                    readOnly 
                    size="small"
                    sx={{ color: '#FFB300' }} // Bright gold star color
                  />
                  <Typography variant="caption" sx={{ ml: 1, fontWeight: 700, color: 'text.primary' }}>
                    {item.rating}
                  </Typography>
                </Box>

                {/* The Food Review Comment */}
                <Typography 
                  variant="body2" 
                  color="text.primary" 
                  sx={{ 
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    color: '#37474F',
                    flexGrow: 1 // Ensures review text aligns properly if comments are different lengths
                  }}
                >
                  "{item.comment?.trim()}"
                </Typography>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CustomerReview;
