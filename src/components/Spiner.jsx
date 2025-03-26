import CircularProgress from '@mui/material/CircularProgress';

export default function Spiner() {

    return (
        <div style={{height : "85vh", display : "flex", alignItems : "center", justifyContent : "center"}}>
            <CircularProgress color="inherit" />
        </div>
    );
}