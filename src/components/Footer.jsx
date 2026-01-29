
import { Box, Typography, Divider, IconButton } from "@mui/material";
import {
  Facebook,
  Instagram,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0f172a", // dark navy (enterprise look)
        color: "#cbd5e1",
        mt: 6,
        px: { xs: 2, sm: 4 },
        py: 4,
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 3,
        }}
      >
        {/* Company Info */}
        <Box>
          <Typography
            variant="h6"
            sx={{ color: "#ffffff", fontWeight: 600, mb: 1 }}
          >
             Registered Office
          </Typography>

          <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
            No 243, First Floor, GST Road,<br />
            Kilampakkam, Vandalur TK,<br />
            Chengalpattu DT,<br />
            Chennai Metro – 600048
          </Typography>
        </Box>

        {/* Contact Info */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: "#ffffff", fontWeight: 500, mb: 1 }}
          >
            Contact
          </Typography>

          <Typography variant="body2">
            📞 +91 99622 91220
          </Typography>
          <Typography variant="body2">
            ✉️ iifmjobs@gmail.com
          </Typography>
        </Box>

        {/* Social Media */}
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ color: "#ffffff", fontWeight: 500, mb: 1 }}
          >
            Follow Us
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              component="a"
              href="https://www.facebook.com/iifm.chennai/"
              target="_blank"
              sx={{ color: "#cbd5e1", "&:hover": { color: "#1877f2" } }}
            >
              <Facebook />
            </IconButton>

            <IconButton
              component="a"
              href="https://www.instagram.com/iifm_chennai/"
              target="_blank"
              sx={{ color: "#cbd5e1", "&:hover": { color: "#e1306c" } }}
            >
              <Instagram />
            </IconButton>

            <IconButton
              component="a"
              href="https://linkedin.com/in/iifm-digital-2721b7324"
              target="_blank"
              sx={{ color: "#cbd5e1", "&:hover": { color: "#0a66c2" } }}
            >
              <LinkedIn />
            </IconButton>

            <IconButton
              component="a"
              href="https://www.youtube.com/channel/UCoy9txbAq_N7xHD9_3EkDAw"
              target="_blank"
              sx={{ color: "#cbd5e1", "&:hover": { color: "#ff0000" } }}
            >
              <YouTube />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Divider */}
      <Divider sx={{ my: 3, borderColor: "#1e293b" }} />

      {/* Bottom Bar */}
      <Typography
        variant="body2"
        align="center"
        sx={{ color: "#94a3b8" }}
      >
        © {new Date().getFullYear()} IIFM Global Verification. All Rights Reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
