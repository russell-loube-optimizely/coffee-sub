import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import image from "../hario.jpg";

const ImageCard = ({ vuid, authId }) => {
  return (
    <Col>
      <Card className="bg-dark text-white">
        <Card.Img src={image} alt="hario-v60" />
        <Card.Body>
          <Card.Text>vuid: {vuid}</Card.Text>
          <Card.Text>authId: {authId}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ImageCard;
