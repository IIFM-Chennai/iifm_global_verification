import emailjs from '@emailjs/browser';

const sendCandidateNotification = async (candidate, action) => {
    const emailParams = {
        action: action, // "Added" or "Deleted"
        name: candidate.name,
        reg_no: candidate.reg_no,
        department: candidate.department,
        academic_year: candidate.academic_year,
        date: new Date().toLocaleString(),
    };

    try {
        await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID2,
            emailParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
        console.log("Notification sent successfully.");
        return true;
    } catch (error) {
        console.error("Failed to send notification:", error?.text || error?.message || error);
        return false;
    }
};

export default sendCandidateNotification;