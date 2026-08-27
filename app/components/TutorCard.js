function TutorCard(props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 m-4 max-w-sm">
      <h2 className="text-xl font-bold text-gray-900">{props.name}</h2>
      <p className="text-gray-600">Subject: {props.subject}</p>
      <p className="text-yellow-600">Rating: {props.rating}</p>
    </div>
  );
}

export default TutorCard;
