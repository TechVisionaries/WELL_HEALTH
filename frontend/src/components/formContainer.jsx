import { Container, Row, Col } from 'react-bootstrap';

const FormContainer = ({ children }) => {
    return (
        <Container>
            <Row className='justify-content-md-center mt-5'>
                <Col xs={12} md={10} className='card p-5 mb-3'>
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer;