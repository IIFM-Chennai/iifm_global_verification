import { useParams } from "react-router-dom";

function CandidateList(){
      const { searchQuery } = useParams();

    return(
        <div>
            <h1>Candidate list {searchQuery}</h1>
        </div>
    )
}

export default CandidateList;