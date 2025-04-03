import { Box, Typography, Button, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const About = () => {

  const images = [
    "/assets/Certificate_Candidate_6.jpg",
    "/assets/Certificate_Candidate_5.jpg",
    "/assets/Certificate_Candidate_4.jpg",
    "/assets/Certificate_Candidate_3.jpg",
    "/assets/Certificate_Candidate_2.jpg",
    "/assets/Certificate_Candidate_1.jpg"
  ];
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h4" align="center" color="#2c3e50" sx={{ fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif", fontSize : "32px", fontWeight : "700" }}>
          Integrated Institute of Facility Management
        </Typography>
        <Typography variant="body1" color="textSecondary" mt={2}>
          The objective of IIFM is to fulfill the global demand for skilled manpower by providing essential on-the-job training through its own programs, there by creating employment opportunities. 
        </Typography>
      </Box>

      {/* Image Slider */}
      <Swiper
        modules={[Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        className="swiper-wrapper"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index} className="swiper-slide">
            <img src={src} loading="lazy" alt={`Training with Placement ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* About Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 4,
          mt: 6,
        }}
      >
        {/* <Box sx={{ flex: 1 }}>
          <Typography variant="h5" color="#2c3e50" sx={{ fontFamily: "Open Sans, Roboto, Oxygen, Ubuntu, Cantarell, Lato, Helvetica Neue, sans-serif", fontSize : "25px", fontWeight : "700" }}>
            Why Choose IIFM?
          </Typography>
          <Typography variant="body1" mt={2}>
          At IIFM, we provide hands-on training in Facility Management, Electrical Maintenance, HVAC Systems, MEP (Mechanical, Electrical, and Plumbing), Power Plant Operations, Fire and Safety, and Water Treatment Plant (WTP) Management. Our industry-focused curriculum is designed with real-world training to equip students with the skills required to excel in their careers. In addition to quality education, we offer placement assistance and career support, helping students secure opportunities in leading companies and ensuring a smooth transition into the workforce.
          </Typography>
          <Button variant="contained" href="tel:+919962291220" sx={{ mt: 3 , backgroundColor : "#4460aa"}}>
          Call Now
          </Button>
        </Box> */}

        <Box sx={{ flex: 1 }}>
          <img
            src="/assets/roadmap.png"
            alt="IIFM Training"
            width="100%"
            style={{ borderRadius: "10px" }}
            loading="lazy"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default About;
