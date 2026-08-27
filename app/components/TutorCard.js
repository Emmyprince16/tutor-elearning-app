function TutorCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Subject: {props.subject}</p>
      <p>Rating: {props.rating}</p>
    </div>
  );
}

export default TutorCard;