import { Box, Typography } from "@mui/material";
import { Facebook, Instagram, LinkedIn, YouTube } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box className="footer" sx={{ background: "#4460aa", color: "white", textAlign: "center", padding: "10px" , marginTop : "40px"}}>
      <Typography variant="body2">&copy; {new Date().getFullYear()} IIFM Global Verification. All Rights Reserved.</Typography>
      
      {/* Social Media Icons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
        <a href="https://www.facebook.com/iifm.chennai/" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
          <Facebook />
        </a>
        <a href="https://www.instagram.com/iifm_chennai/" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
          <Instagram />
        </a>
        <a href="https://linkedin.com/in/iifm-digital-2721b7324" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
          <LinkedIn />
        </a>
        <a href="https://www.youtube.com/channel/UCoy9txbAq_N7xHD9_3EkDAw" target="_blank" rel="noopener noreferrer" style={{ color: "white" }}>
          <YouTube />
        </a>
      </Box>
      
      <Typography variant="body2" sx={{ marginTop: "5px" }}>
        Contact: +91 9962291220 | Email: iifmjobs@gmail.com
      </Typography>
    </Box>
  );
};

export default Footer;
