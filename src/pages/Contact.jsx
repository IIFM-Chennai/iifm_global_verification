import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, CircularProgress, Typography } from "@mui/material";
import emailjs from '@emailjs/browser';
import { toast } from "react-toastify";

const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captcha = "";
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

const Contact = () => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
            subject: "",
            message: "",
            captchaInput: "",
        },
    });

    const [loading, setLoading] = useState(false);
    const [captcha, setCaptcha] = useState("");

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const refreshCaptcha = () => {
        setCaptcha(generateCaptcha());
    };

    const onSubmit = async (data) => {
        if (loading) return;
        setLoading(true);

        try {
            if (data.captchaInput !== captcha) {
                toast.error("Invalid CAPTCHA. Please try again.");
                refreshCaptcha();
                setLoading(false);
                return;
            }

            const emailParams = {
                to_name: "IIFM",
                from_name: data.name,
                from_email: data.email,
                mobile: data.mobile,
                subject: data.subject,
                message: data.message,
                website: "IIFM Global Verification Website",
            };

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                emailParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            toast.success("Message sent successfully!");
            reset();
            refreshCaptcha();
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 500,
                width: "80%", // Adjusts width for smaller screens
                margin: "auto",
                padding: { xs: 2, sm: 3 }, // Responsive padding
                boxShadow: 3,
                borderRadius: 2,
                background: "#fff",
                marginTop: 4
            }}
        >
            <Typography variant="h5" textAlign="center" gutterBottom>
                Contact Us
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Controller name="name" control={control} rules={{ required: "Name is required" }} render={({ field }) => <TextField {...field} label="Name" fullWidth margin="normal" error={!!errors.name} helperText={errors.name?.message} />} />

                <Controller name="email" control={control} rules={{ required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" } }} render={({ field }) => <TextField {...field} label="Email" fullWidth margin="normal" error={!!errors.email} helperText={errors.email?.message} />} />

                <Controller name="mobile" control={control} rules={{ required: "Mobile number is required", pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number" } }} render={({ field }) => <TextField {...field} label="Mobile Number" fullWidth margin="normal" error={!!errors.mobile} helperText={errors.mobile?.message} />} />

                <Controller name="subject" control={control} rules={{ required: "Subject is required" }} render={({ field }) => <TextField {...field} label="Subject" fullWidth margin="normal" error={!!errors.subject} helperText={errors.subject?.message} />} />

                <Controller name="message" control={control} rules={{ required: "Message is required" }} render={({ field }) => <TextField {...field} label="Message" fullWidth margin="normal" multiline rows={4} error={!!errors.message} helperText={errors.message?.message} />} />

                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
                    <Typography variant="h6" sx={{ background: "#eee", padding: "10px", borderRadius: "5px", fontWeight: "bold" }}>{captcha}</Typography>
                    <Button onClick={refreshCaptcha} variant="outlined">Refresh</Button>
                </Box>

                <Controller name="captchaInput" control={control} rules={{ required: "Enter the CAPTCHA" }} render={({ field }) => <TextField {...field} label="Enter CAPTCHA" fullWidth margin="normal" error={!!errors.captchaInput} helperText={errors.captchaInput?.message} />} />

                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, backgroundColor : "#4460aa" }} disabled={loading}>
                    {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Send Message"}
                </Button>
            </form>
        </Box>
    );
};

export default Contact;
