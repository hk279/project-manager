import { Col, Row } from "antd";

// Component for showing single key-value pair in a row format.
const InfoRow = ({ label, value, space }) => {
    return (
        <Row wrap={false} style={{ marginBottom: space + "px" }}>
            <Col flex="30%">{label}</Col>
            <Col flex="auto">{value}</Col>
        </Row>
    );
};

export default InfoRow;
